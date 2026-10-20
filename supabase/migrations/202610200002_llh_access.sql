begin;
-- No password fields, profiles, or progress records. Supabase Auth owns identity.
create table public.customer_entitlements (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id),
  purchase_email text not null check (purchase_email = lower(btrim(purchase_email))),
  user_id uuid references auth.users(id) on delete restrict,
  source text not null check (source in ('admin_test','verified_purchase')),
  source_reference text not null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  revoked_at timestamptz,
  unique(source, source_reference)
);
create index entitlement_pending_email on public.customer_entitlements(purchase_email) where user_id is null and revoked_at is null;
create index entitlement_owner on public.customer_entitlements(user_id) where revoked_at is null;
-- Snapshot inclusions at grant time. Future catalog changes cannot silently change a purchase.
create table public.entitlement_kits (
  entitlement_id uuid not null references public.customer_entitlements(id),
  kit_id text not null references public.kits(id),
  primary key(entitlement_id,kit_id)
);
create table llh_private.kit_resources (
  id uuid primary key default gen_random_uuid(),
  kit_id text not null references public.kits(id),
  title text not null,
  format text not null default 'PDF',
  size_bytes bigint check (size_bytes >= 0),
  sort_order integer not null default 0,
  provider text not null check (provider in ('supabase_storage','restricted_drive')),
  locator text not null,
  enabled boolean not null default false
);
create table llh_private.settings (
  singleton boolean primary key default true check (singleton),
  allow_test_entitlements boolean not null default false
);
insert into llh_private.settings(singleton) values(true);
alter table llh_private.settings enable row level security;
alter table llh_private.kit_resources enable row level security;
revoke all on all tables in schema llh_private from public,anon,authenticated;

create function llh_private.verified_user(p_user uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from auth.users where id=p_user and email_confirmed_at is not null
    and (banned_until is null or banned_until < now()));
$$;
create function llh_private.has_kit(p_user uuid,p_kit text) returns boolean
language sql stable security definer set search_path = '' as $$
  select llh_private.verified_user(p_user) and exists (
    select 1 from public.customer_entitlements e
    join public.entitlement_kits ek on ek.entitlement_id=e.id
    where e.user_id=p_user and e.revoked_at is null and ek.kit_id=p_kit);
$$;
revoke all on all functions in schema llh_private from public,anon,authenticated;
-- Used by RLS; exposes only the caller's verification state, not an arbitrary user's.
create function public.llh_is_verified() returns boolean
language sql stable security definer set search_path = '' as $$
  select llh_private.verified_user(auth.uid());
$$;
revoke all on function public.llh_is_verified() from public,anon;
grant execute on function public.llh_is_verified() to authenticated;

alter table public.customer_entitlements enable row level security;
alter table public.entitlement_kits enable row level security;
revoke all on public.customer_entitlements,public.entitlement_kits from public,anon,authenticated;
grant select on public.customer_entitlements,public.entitlement_kits to authenticated;
create policy own_entitlements on public.customer_entitlements for select to authenticated
 using (user_id=(select auth.uid()) and (select public.llh_is_verified()));
create policy own_entitlement_kits on public.entitlement_kits for select to authenticated using (
 exists(select 1 from public.customer_entitlements e where e.id=entitlement_id and e.user_id=(select auth.uid())));

-- One request per library load: verify identity, claim pending grants, return safe metadata.
create function public.llh_library() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid(); v_email text; v_result jsonb;
begin
  if not llh_private.verified_user(v_user) then
    raise exception 'Verified sign-in required' using errcode='42501';
  end if;
  select lower(btrim(email)) into v_email from auth.users where id=v_user;
  update public.customer_entitlements set user_id=v_user,claimed_at=now()
    where user_id is null and revoked_at is null and purchase_email=v_email;
  select jsonb_agg(jsonb_build_object(
    'id', k.id, 'name', k.name, 'description', k.description,
    'accessible', llh_private.has_kit(v_user,k.id),
    'resources', coalesce((select jsonb_agg(jsonb_build_object(
      'id',r.id,'title',r.title,'format',r.format,'size_bytes',r.size_bytes) order by r.sort_order,r.id)
      from llh_private.kit_resources r where r.kit_id=k.id and r.enabled
        and llh_private.has_kit(v_user,k.id)), '[]'::jsonb)
    ) order by k.sort_order) into v_result from public.kits k;
  return coalesce(v_result,'[]'::jsonb);
end;
$$;
revoke all on function public.llh_library() from public,anon;
grant execute on function public.llh_library() to authenticated;

-- Service-only resolver: Edge Function obtains p_user from Auth, NEVER request JSON.
create function public.llh_resource_location(p_user uuid,p_resource uuid) returns jsonb
language sql stable security definer set search_path = '' as $$
 select jsonb_build_object('provider',r.provider,'locator',r.locator)
 from llh_private.kit_resources r where r.id=p_resource and r.enabled
   and llh_private.has_kit(p_user,r.kit_id);
$$;
revoke all on function public.llh_resource_location(uuid,uuid) from public,anon,authenticated;
grant execute on function public.llh_resource_location(uuid,uuid) to service_role;
commit;
