begin;
create schema if not exists llh_private;
revoke all on schema llh_private from public, anon, authenticated;

create table public.products (
  id text primary key check (id in ('analyst','scientist','engineer','complete')),
  name text not null,
  price_paise integer not null check (price_paise > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  active boolean not null default true
);
create table public.kits (
  id text primary key check (id in ('analyst','scientist','engineer')),
  name text not null,
  description text not null,
  sort_order integer not null
);
create table public.product_kits (
  product_id text not null references public.products(id),
  kit_id text not null references public.kits(id),
  primary key (product_id, kit_id)
);
insert into public.products (id,name,price_paise) values
 ('analyst','Data & BI Analyst',39900),
 ('scientist','Data Scientist & Gen AI',49900),
 ('engineer','Machine Learning Engineer',49900),
 ('complete','Data Science + Gen AI + ML Engineer Complete Kit',89900);
insert into public.kits values
 ('analyst','Data & BI Analyst','Your analytics handbooks, practice and solutions.',1),
 ('scientist','Data Scientist & Gen AI','Your data science and Gen AI learning resources.',2),
 ('engineer','Machine Learning Engineer','Your machine learning and MLOps learning resources.',3);
insert into public.product_kits values
 ('analyst','analyst'),('scientist','scientist'),('engineer','engineer'),
 ('complete','scientist'),('complete','engineer'),('complete','analyst');

alter table public.products enable row level security;
alter table public.kits enable row level security;
alter table public.product_kits enable row level security;
revoke all on public.products, public.kits, public.product_kits from anon, authenticated;
grant select on public.products, public.kits, public.product_kits to authenticated;
create policy catalog_read on public.products for select to authenticated using (active);
create policy kits_read on public.kits for select to authenticated using (true);
create policy mappings_read on public.product_kits for select to authenticated using (true);
commit;
