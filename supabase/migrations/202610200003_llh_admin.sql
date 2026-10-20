begin;
-- No public admin page or grant endpoint. Only the trusted operator's CLI uses these RPCs.
create function public.llh_admin_grant_test(p_email text,p_product text,p_reference text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_existing public.customer_entitlements%rowtype;
begin
 if not (select allow_test_entitlements from llh_private.settings where singleton) then
   raise exception 'Test grants disabled' using errcode='42501';
 end if;
 if p_email is null or length(p_email)>254 or btrim(p_email) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
   or p_reference is null or length(btrim(p_reference)) not between 8 and 120 then
   raise exception 'Invalid test grant';
 end if;
 if not exists(select 1 from public.products where id=p_product and active) then raise exception 'Unknown product'; end if;
 insert into public.customer_entitlements(product_id,purchase_email,source,source_reference)
 values(p_product,lower(btrim(p_email)),'admin_test',p_reference)
 on conflict(source,source_reference) do nothing returning id into v_id;
 if v_id is null then
   select * into v_existing from public.customer_entitlements where source='admin_test' and source_reference=p_reference;
   if v_existing.product_id<>p_product or v_existing.purchase_email<>lower(btrim(p_email)) then
     raise exception 'Reference already used';
   end if;
   return v_existing.id;
 end if;
 insert into public.entitlement_kits(entitlement_id,kit_id)
   select v_id,kit_id from public.product_kits where product_id=p_product;
 return v_id;
end;
$$;
create function public.llh_admin_revoke_test(p_reference text) returns void
language sql security definer set search_path = '' as $$
 update public.customer_entitlements set revoked_at=coalesce(revoked_at,now())
 where source='admin_test' and source_reference=p_reference;
$$;
revoke all on function public.llh_admin_grant_test(text,text,text),public.llh_admin_revoke_test(text) from public,anon,authenticated;
grant execute on function public.llh_admin_grant_test(text,text,text),public.llh_admin_revoke_test(text) to service_role;
-- Do not add a verified-purchase grant API until a payment verifier exists in Phase 2.
commit;
