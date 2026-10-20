const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4194/Learnlytics.notes/';
const urls = { analyst:'S2y4eZ3', scientist:'fain7HM', engineer:'6j2zp8fF', complete:'qLYK5iB' };
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  for(const width of [390,1440]) {
   const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});
   // Verify destinations without contacting Razorpay or submitting any payment.
   await context.route('**/*',route=>{
    const origin=new URL(route.request().url()).origin;
    if(origin==='https://rzp.io')return route.fulfill({contentType:'text/html',body:'<title>Payment destination test</title>'});
    return origin===new URL(base).origin?route.continue():route.abort();
   });
   const page=await context.newPage();
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   for(const [kit,id] of Object.entries(urls)) {
    await page.goto(base);
    if(await page.locator('#product-title').count()) await page.locator('.breadcrumbs [data-view="home"]').first().click();
    await page.locator(`.goal-option:has(input[value="${kit}"])`).click();
    assert((await page.locator('#recommended-title').innerText()).trim().endsWith('Interview'));
    assert(!/coming soon/i.test(await page.locator('#learning-hub').innerText()));
    assert(!/coming soon/i.test(await page.locator('.learning-toolkit').innerText()));
    const logo=await page.locator('.site-header .brand img').boundingBox();
    assert.equal(Math.round(logo.width),width===390?140:200);
    await page.locator('#kit-details').click();
    await page.waitForSelector('#product-title');
    assert(!/coming soon/i.test(await page.locator('#learning-hub').innerText()));
    assert(!/coming soon/i.test(await page.locator('.learning-toolkit').innerText()));
    const links=page.locator('[data-checkout]');
    assert.equal(await links.count(),4);
    for(let i=0;i<4;i++) {
     const link=links.nth(i);
     assert.equal(await link.getAttribute('href'),`https://rzp.io/rzp/${id}`);
     if(i===0 && width===390)await page.locator('.menu-toggle').click();
     if(i===3) {
      await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
      await page.waitForSelector('.product-sticky.is-visible');
     }
     const popupPromise=page.waitForEvent('popup');
     await link.click();
     const popup=await popupPromise;await popup.waitForLoadState();
     assert.equal(popup.url(),`https://rzp.io/rzp/${id}`);
     assert.equal(await popup.evaluate(()=>window.opener),null);
     await popup.close();
     if(i===0 && width===390)await page.locator('.menu-toggle').click();
    }
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }
   assert.deepEqual(errors,[]);
   await page.goto(base);
   if(await page.locator('#product-title').count()) await page.locator('.breadcrumbs [data-view="home"]').first().click();
   await page.screenshot({path:`screenshots/header-checkout-${width}.png`});
   await context.close();
  }
  console.log('PASS: all 16 payment links open the correct isolated new tab at mobile/desktop sizes; titles, release labels, logos and overflow verified.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
