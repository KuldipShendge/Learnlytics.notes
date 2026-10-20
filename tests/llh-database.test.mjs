import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('PostgreSQL migrations: four accounts, RLS, verified claims, bundles and revocation', async () => {
  const db = new PGlite();
  try {
    // Supabase-owned objects only are stubbed. All LLH schemas/functions/policies are real migrations.
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,banned_until timestamptz);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      grant usage on schema auth to authenticated,anon,service_role;
      grant execute on function auth.uid() to authenticated,anon,service_role;
      grant usage on schema public to authenticated,anon,service_role;`);
    for (const file of (await readdir('supabase/migrations')).sort()) {
      await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'));
    }
    const ids = Array.from({ length: 6 }, (_, i) => `00000000-0000-4000-8000-${String(i + 1).padStart(12,'0')}`);
    const products = ['analyst','scientist','engineer','complete'];
    for (let i=0;i<ids.length;i++) await db.query('insert into auth.users values($1,$2,$3,null)', [ids[i],`customer${i}@example.test`,i===4 ? null : '2026-10-20T00:00:00Z']);
    const act = async (role, user, sql, params=[]) => {
      await db.exec(`set role ${role}`);
      await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user || '']);
      try { return await db.query(sql,params); } finally { await db.exec('reset role'); }
    };
    await assert.rejects(act('service_role',null,"select public.llh_admin_grant_test('customer0@example.test','analyst','test-disabled')"),/disabled/);
    await db.exec('update llh_private.settings set allow_test_entitlements=true');
    for (let i=0;i<products.length;i++) await act('service_role',null,'select public.llh_admin_grant_test($1,$2,$3)',[`customer${i}@example.test`,products[i],`fixture-${i}`]);
    await act('service_role',null,"select public.llh_admin_grant_test('customer4@example.test','complete','fixture-unverified')");
    const resourceIds=[];
    for (const kit of products.slice(0,3)) {
      const {rows}=await db.query("insert into llh_private.kit_resources(kit_id,title,provider,locator,enabled) values($1,$2,'supabase_storage',$3,true) returning id",[kit,`${kit} test file`,`fixtures/${kit}.txt`]);
      resourceIds.push(rows[0].id);
    }
    await assert.rejects(act('anon',null,'select public.llh_library()'),/permission denied/);
    await assert.rejects(act('authenticated',ids[4],'select public.llh_library()'),/Verified sign-in required/);
    for (let i=0;i<4;i++) {
      const {rows}=await act('authenticated',ids[i],'select public.llh_library() as library');
      const library=rows[0].library;
      assert.deepEqual(library.filter(k=>k.accessible).map(k=>k.id).sort(),i===3 ? products.slice(0,3).sort() : [products[i]]);
      assert.equal(library.filter(k=>k.accessible).flatMap(k=>k.resources).length,i===3?3:1);
      assert(library.filter(k=>!k.accessible).every(k=>k.resources.length===0));
      assert(!JSON.stringify(library).includes('locator'));
      assert(!JSON.stringify(library).includes('fixtures/'));
      const ent=await act('authenticated',ids[i],'select * from public.customer_entitlements');
      assert.equal(ent.rows.length,1);
      assert.equal(ent.rows[0].user_id,ids[i]);
      assert.equal((await act('authenticated',ids[i],'select * from public.entitlement_kits')).rows.length,i===3?3:1);
      await assert.rejects(act('authenticated',ids[i],"insert into public.customer_entitlements(product_id,purchase_email,source,source_reference) values('complete','attacker@example.test','verified_purchase','forged')"),/permission denied/);
      await assert.rejects(act('authenticated',ids[i],"update public.customer_entitlements set product_id='complete'"),/permission denied/);
      await assert.rejects(act('authenticated',ids[i],"insert into public.entitlement_kits select id,'engineer' from public.customer_entitlements"),/permission denied/);
      await assert.rejects(act('authenticated',ids[i],"select * from llh_private.kit_resources"),/permission denied/);
      await assert.rejects(act('authenticated',ids[i],"select public.llh_admin_grant_test('customer0@example.test','complete','attack-grant')"),/permission denied/);
      await assert.rejects(act('authenticated',ids[i],'select public.llh_resource_location($1,$2)',[ids[3],resourceIds[0]]),/permission denied/);
      for (let j=0;j<3;j++) {
        const {rows: resolved}=await act('service_role',null,'select public.llh_resource_location($1,$2) as resource',[ids[i],resourceIds[j]]);
        assert.equal(Boolean(resolved[0].resource),i===3 || i===j);
      }
    }
    assert.equal((await act('authenticated',ids[5],'select public.llh_library() as library')).rows[0].library.filter(k=>k.accessible).length,0);
    // Repeated loads/grants do not create duplicate records.
    await act('authenticated',ids[0],'select public.llh_library()');
    await act('service_role',null,"select public.llh_admin_grant_test('customer0@example.test','analyst','fixture-0')");
    assert.equal((await db.query('select count(*)::int as n from public.customer_entitlements')).rows[0].n,5);
    await assert.rejects(act('service_role',null,"select public.llh_admin_grant_test('customer0@example.test','complete','fixture-0')"),/Reference already used/);
    await act('service_role',null,"select public.llh_admin_grant_test('customer0@example.test','engineer','fixture-multiple')");
    assert.equal((await act('authenticated',ids[0],'select public.llh_library() as library')).rows[0].library.filter(k=>k.accessible).length,2);
    await act('service_role',null,"select public.llh_admin_revoke_test('fixture-0')");
    assert.deepEqual((await act('authenticated',ids[0],'select public.llh_library() as library')).rows[0].library.filter(k=>k.accessible).map(k=>k.id),['engineer']);
    assert.equal((await act('service_role',null,'select public.llh_resource_location($1,$2) as resource',[ids[0],resourceIds[0]])).rows[0].resource,null);
    // A claimed purchase cannot be stolen by a different account later using the old email.
    await db.query('update auth.users set email=$1 where id=$2',['changed@example.test',ids[1]]);
    await db.query('update auth.users set email=$1 where id=$2',['customer1@example.test',ids[5]]);
    assert.equal((await act('authenticated',ids[5],'select public.llh_library() as library')).rows[0].library.filter(k=>k.accessible).length,0);
    // JWT/user metadata is not the source of verified-email truth.
    await db.query('update auth.users set email_confirmed_at=null where id=$1',[ids[2]]);
    await assert.rejects(act('authenticated',ids[2],'select public.llh_library()'),/Verified sign-in required/);
    assert.equal((await act('authenticated',ids[2],'select * from public.customer_entitlements')).rows.length,0);
    assert.equal((await act('service_role',null,'select public.llh_resource_location($1,$2) as resource',[ids[2],resourceIds[2]])).rows[0].resource,null);
    // End-user cannot edit catalog prices or map a cheap kit to the combined bundle.
    await assert.rejects(act('authenticated',ids[0],'update public.products set price_paise=1'),/permission denied/);
    await assert.rejects(act('authenticated',ids[0],"insert into public.product_kits values('analyst','engineer')"),/permission denied/);
    const prices=(await db.query('select id,price_paise from public.products order by id')).rows;
    assert.deepEqual(prices.map(p=>p.price_paise),[39900,89900,49900,49900]);
  } finally { await db.close(); }
});
