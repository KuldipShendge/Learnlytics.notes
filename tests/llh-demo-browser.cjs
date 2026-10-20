const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { mkdir } = require('node:fs/promises');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4194/Learnlytics.notes/';
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true});
 try {
  await mkdir('screenshots',{recursive:true});
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [], apiCalls = [];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',request=>{
   // Existing homepage YouTube frames are unrelated to the local LLH demo.
   if (request.frame() === page.mainFrame() && new URL(request.frame().url()).pathname.endsWith('/llh.html')
     && ['fetch','xhr'].includes(request.resourceType())) apiCalls.push(request.url());
  });
  for(const width of [320,390,900,1440]) {
   await page.setViewportSize({width,height:950});
   await page.goto(base);
   const link = page.locator('#app .site-header .header-llh-link');
   await link.waitFor({state:'visible'});
   const logo = await page.locator('#app .site-header .brand').boundingBox();
   const box = await link.boundingBox();
   assert(box.x >= logo.x + logo.width, 'LLH is immediately right of logo');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Header overflow at ${width}`);
   assert.equal(await link.getAttribute('href'),'llh.html');
   if(width===390)await page.screenshot({path:'screenshots/llh-demo-header-mobile.png'});
  }
  await page.locator('#app .header-llh-link').click();
  await page.waitForSelector('#llh-auth:not([hidden])');
  assert.equal(page.url(),new URL('llh.html',base).href);
  assert(await page.locator('.llh-demo-badge').first().isVisible());
  assert.equal(await page.locator('script[src*="llh-client"]').count(),0);
  await page.locator('#llh-email').fill('admin'); await page.locator('#llh-password').fill('wrong');
  await page.locator('#auth-submit').click();
  assert(await page.locator('#llh-auth').isVisible());
  for(const width of [390,1440]) {
   await page.setViewportSize({width,height:950});
   await page.screenshot({path:`screenshots/llh-demo-login-${width}.png`,fullPage:true});
  }
  await page.locator('#llh-password').fill('admin'); await page.locator('#auth-submit').click();
  await page.waitForSelector('#llh-library:not([hidden])');
  for(const kit of ['analyst','scientist','engineer','complete']) {
   await page.locator('#demo-kit').selectOption(kit);
   assert.equal(await page.locator('.llh-kit:not(.is-locked)').count(),kit==='complete'?3:1);
   assert.equal(await page.locator('.is-locked [data-resource-id]').count(),0);
   assert.equal(await page.locator('.llh-demo-trackers .hub-preview-panel').count(),2);
   for(const width of [320,390,1440]) {
    await page.setViewportSize({width,height:950});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${kit} overflow at ${width}`);
    if(kit==='complete' && width!==320)await page.screenshot({path:`screenshots/llh-demo-library-${width}.png`,fullPage:true});
   }
  }
  await page.locator('[data-resource-id]').first().click();
  assert(await page.locator('dialog').isVisible());
  await page.locator('dialog button').click();
  assert.deepEqual(apiCalls, [],'Demo must make no API requests');
  assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
  await page.reload();
  await page.waitForSelector('#llh-auth:not([hidden])');
  assert.equal(await page.locator('.llh-kit').count(),0,'Reload clears memory-only login');
  await page.locator('#llh-email').fill('admin'); await page.locator('#llh-password').fill('admin'); await page.locator('#auth-submit').click();
  await page.locator('#sign-out').click();
  assert.equal(await page.locator('.llh-kit').count(),0);
  assert(await page.locator('#llh-auth').isVisible());
  assert.deepEqual(errors,[]);
  console.log('PASS: header 320/390/900/1440px, demo login, four libraries, trackers, no APIs/storage, reload/logout reset.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
