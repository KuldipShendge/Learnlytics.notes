import test from 'node:test';
import assert from 'node:assert/strict';
import { createResourceHandler } from '../supabase/functions/llh-resource-access/handler.js';
const id='00000000-0000-4000-8000-000000000001';
const origin='https://project.supabase.co';
const request=(body={},token='valid',method='POST')=>new Request('https://project.supabase.co/functions/v1/llh-resource-access',{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),'Content-Type':'application/json'},...(method==='POST'?{body:JSON.stringify({resource_id:id,...body})}:{})});
test('resource endpoint rejects direct unauthorized calls and never trusts caller identity',async()=>{
 const seen=[];
 const dependencies={ enabled:true, origins:['https://staging.example.test'],storageOrigin:origin,
 authenticate:async token=>token==='valid'?{id:'verified-user',email_confirmed_at:'2026-10-20'}:null,
 resolve:async (user,resource)=>{seen.push([user,resource]);return {provider:'supabase_storage',locator:'test/file.txt'};},
 sign:async (path,ttl)=>{assert.equal(ttl,60);return `${origin}/storage/v1/object/sign/llh-paid/${path}?token=temporary`;}};
 const handler=createResourceHandler(dependencies);
 assert.equal((await handler(request({},null))).status,401);
 assert.equal((await handler(request({},'forged'))).status,401);
 assert.equal((await handler(request({},'valid','GET'))).status,405);
 assert.equal((await handler(request({resource_id:'bad'}))).status,400);
 assert.equal((await handler(request({resource_id:null}))).status,400);
 const result=await handler(request({user_id:'other-customer',email:'other@example.test',product_id:'complete',url:'https://attacker.test'}));
 assert.equal(result.status,200);
 assert.deepEqual(seen,[['verified-user',id]]);
 assert.equal(result.headers.get('cache-control'),'no-store');
 assert.equal((await result.json()).expires_in,60);
 for (const [overrides,status] of [
  [{authenticate:async()=>({id:'unverified'})},401],
  [{resolve:async()=>null},404],
  [{enabled:false},409],
  [{resolve:async()=>({provider:'restricted_drive',locator:'private-drive-id'})},409],
  [{resolve:async()=>({provider:'supabase_storage',locator:'../private'})},409],
  [{sign:async()=> 'https://evil.test/steal'},503],
  [{resolve:async()=>{throw new Error('secret database locator');}},503],
 ]) {
  const response=await createResourceHandler({...dependencies,...overrides})(request());
  assert.equal(response.status,status);
  assert(!JSON.stringify(await response.json()).includes('secret database'));
 }
 const hostile=request(); hostile.headers.set('Origin','https://evil.test');
 assert.equal((await handler(hostile)).status,403);
});
