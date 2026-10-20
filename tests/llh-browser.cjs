const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { build } = require('esbuild');
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4188/Learnlytics.notes/';
const api = 'https://llh-browser-test.supabase.co';
const password = 'Local-fixture-only!2026';
const kits = ['analyst','scientist','engineer'];
const users = Object.fromEntries([...kits,'complete'].map((kit,i)=>[kit,{
 id:`00000000-0000-4000-8000-${String(i+1).padStart(12,'0')}`,email:`${kit}@example.test`,
 email_confirmed_at:'2026-10-20T00:00:00Z',created_at:'2026-10-20T00:00:00Z',aud:'authenticated',role:'authenticated',app_metadata:{provider:'email'},user_metadata:{},
}]));
const token=user=>[btoa(JSON.stringify({alg:'HS256',typ:'JWT'})),btoa(JSON.stringify({sub:user.id,exp:Math.floor(Date.now()/1000)+3600,role:'authenticated',email:user.email})),btoa('local-mocked-signature')].join('.');
const session=user=>({access_token:token(user),token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,refresh_token:`local-refresh-${user.id}`,user});
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const bundle=await build({entryPoints:['js/llh.js'],bundle:true,write:false,platform:'browser',format:'esm',plugins:[{name:'test-public-config',setup(b){b.onLoad({filter:/[\\/]llh-config\.js$/},()=>({contents:`export const llhConfig = ${JSON.stringify({supabaseUrl:api,publishableKey:'sb_publishable_browser_fixture'})};`,loader:'js'}));}}]});
 const errors=[];
 async function setup(kit='analyst') {
  const context=await browser.newContext({viewport:{width:390,height:950},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  let rpcCount=0,verifyCount=0,updates=0,resetCount=0,rateLimited=false;
  await page.route('**/*',async route=>{
   const request=route.request(), target=new URL(request.url());
   if(target.pathname.endsWith('/assets/vendor/llh-client.js'))return route.fulfill({contentType:'application/javascript',body:bundle.outputFiles[0].text});
   if(target.origin!==api)return target.origin===new URL(url).origin ? route.continue():route.abort();
   const json=(data,status=200)=>route.fulfill({status,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(data)});
   const body=request.postDataJSON();
   if(target.pathname==='/auth/v1/token') {
    if(rateLimited)return json({msg:'private detail',code:'over_request_rate_limit'},429);
    return body.password===password ? json(session(users[kit])) : json({msg:'Invalid login credentials',code:'invalid_credentials'},400);
   }
   if(target.pathname==='/auth/v1/user') {
    if(request.method()==='PUT'){updates++;return json(users[kit]);}
    return json(users[kit]);
   }
   if(target.pathname==='/auth/v1/signup')return json({id:'unconfirmed-id',email:body.email,identities:[]});
   if(target.pathname==='/auth/v1/recover'){resetCount++;return json({});}
   if(target.pathname==='/auth/v1/resend')return json({});
   if(target.pathname==='/auth/v1/logout')return json({});
   if(target.pathname==='/auth/v1/verify'){verifyCount++;return body.token_hash==='x'.repeat(32)?json({msg:'expired',code:'otp_expired'},403):json(session(users[kit]));}
   if(target.pathname==='/rest/v1/rpc/llh_library') {
    rpcCount++;
    return json(kits.map((id,i)=>({id,name:{analyst:'Data & BI Analyst',scientist:'Data Scientist & Gen AI',engineer:'Machine Learning Engineer'}[id],description:'Your kit resources.',accessible:kit==='complete'||id===kit,resources:kit==='complete'||id===kit?[{id:`10000000-0000-4000-8000-${String(i+1).padStart(12,'0')}`,title:`${id} Handbook`,format:'PDF',size_bytes:1024}]:[]})));
   }
   if(target.pathname==='/functions/v1/llh-resource-access')return json({error:'Resource delivery is not enabled yet.'},409);
   return json({message:'Unexpected mock endpoint'},404);
  });
  return {page,context,counts:()=>({rpcCount,verifyCount,updates,resetCount}),limit:()=>{rateLimited=true;}};
 }
 try {
  for(const kit of [...kits,'complete']){
   const {page,context,counts}=await setup(kit);
   await page.goto(new URL('learnlytics-learning-hub',url).href);
   await page.locator('#llh-email').fill(users[kit].email);
   await page.locator('#llh-password').fill(password);
   await page.locator('#auth-submit').click();
   await page.waitForSelector('.llh-kit');
   assert.equal(await page.locator('.llh-kit:not(.is-locked)').count(),kit==='complete'?3:1);
   assert.equal(await page.locator('.is-locked [data-resource-id]').count(),0);
   assert.equal(counts().rpcCount,1);
   assert(!await page.locator('#library-kits').innerHTML().then(s=>s.includes('/storage/')));
   for(const width of [390,1440]){
    await page.setViewportSize({width,height:950});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(kit==='complete')await page.screenshot({path:`screenshots/llh-library-${width}.png`,fullPage:true});
   }
   await page.reload();await page.waitForSelector('.llh-kit');
   assert.equal(counts().rpcCount,2,'One load on session restoration, no polling');
   await page.locator('[data-resource-id]').first().click();
   await page.waitForFunction(()=>document.getElementById('llh-message').textContent.includes('not available'));
   await page.locator('#sign-out').click();await page.waitForSelector('#llh-auth:not([hidden])');
   assert.equal(await page.locator('#library-kits').innerHTML(),'');
   console.log(`PASS browser: ${kit} library, locked kits, persistence, signout, responsive layout.`);
   await context.close();
  }
  {
   const {page,context,counts}=await setup();
   await page.goto(new URL('learnlytics-learning-hub',url).href);
   await page.locator('[data-mode="signup"]').click();
   await page.locator('#llh-email').fill('new@example.test');await page.locator('#llh-password').fill(password);await page.locator('#llh-confirm').fill(password);
   await page.locator('#auth-submit').click();await page.waitForFunction(()=>document.getElementById('llh-message').textContent.includes('verification email'));
   assert.equal(counts().rpcCount,0,'Signup alone must not grant or load access');
   await page.goto(new URL(`learnlytics-learning-hub#type=signup&token_hash=${'a'.repeat(32)}`,url).href);
   await page.waitForSelector('#llh-link:not([hidden])');assert(!page.url().includes('token_hash'));assert.equal(counts().verifyCount,0);
   await page.waitForTimeout(1600);await page.locator('#verify-link').click();await page.waitForSelector('.llh-kit');assert.equal(counts().verifyCount,1);
   await context.close();
  }
  {
   const {page,context,counts}=await setup();
   await page.goto(new URL('learnlytics-learning-hub',url).href);
   await page.locator('[data-mode="forgot"]').click();await page.locator('#llh-email').fill('unknown@example.test');await page.locator('#auth-submit').click();
   await page.waitForFunction(()=>document.getElementById('llh-message').textContent.includes('If this address has an account'));
   assert.equal(counts().resetCount,1);
   await page.goto(new URL(`learnlytics-learning-hub#type=recovery&token_hash=${'b'.repeat(32)}`,url).href);
   await page.waitForSelector('#llh-link:not([hidden])');await page.waitForTimeout(1600);await page.locator('#verify-link').click();
   await page.waitForFunction(()=>document.getElementById('auth-title').textContent==='Choose a new password');
   assert.equal(counts().rpcCount,0,'Recovery session must stay in password-reset flow');
   await page.waitForTimeout(1600);await page.locator('#llh-password').fill(password);await page.locator('#llh-confirm').fill(password);await page.locator('#auth-submit').click();
   await page.waitForFunction(()=>document.getElementById('llh-message').textContent.includes('Password updated'));
   assert.equal(counts().updates,1);
   await page.goto(new URL(`learnlytics-learning-hub#type=recovery&token_hash=${'x'.repeat(32)}`,url).href);await page.waitForTimeout(1600);await page.locator('#verify-link').click();
   await page.waitForFunction(()=>document.getElementById('llh-message').textContent.includes('invalid or expired'));
   assert.equal(counts().updates,1);
   await context.close();
  }
  {
   const {page,context,limit}=await setup();limit();await page.goto(new URL('learnlytics-learning-hub',url).href);
   await page.locator('#llh-email').fill('analyst@example.test');await page.locator('#llh-password').fill(password);await page.locator('#auth-submit').click();
   await page.waitForFunction(()=>document.getElementById('llh-message').textContent.includes('Too many attempts'));
   assert(!(await page.locator('#llh-message').innerText()).includes('private detail'));
   await context.close();
  }
  assert.deepEqual(errors,[]);
  console.log('PASS browser: signup verification, recovery, expired link, safe rate-limit error. Auth responses are mocked; SMTP not exercised.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
