const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.PREVIEW_URL || 'http://127.0.0.1:4194/Learnlytics.notes/';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  for(const width of [390,1440]) {
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort());
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const [fragment,selector,word] of [
    ['kit-analyst','#product-title','Data & BI'],
    ['kit-scientist','#product-title','Data Scientist'],
    ['kit-engineer','#product-title','Machine Learning'],
    ['kit-complete','#product-title','Data Science'],
    ['legacy-resources','#career-resources-title','Career Resources'],
    ['legacy-reviews','#reviews-title','Loved by Aspirants'],
    ['legacy-about','#about-title','Structured learning'],
   ]) {
    await page.goto(`${base}#${fragment}`);
    await page.waitForFunction(({selector,word})=>document.querySelector(selector)?.innerText.includes(word),{selector,word});
    assert((await page.locator(selector).innerText()).includes(word),fragment);
    assert.equal(page.url(),base,'Legacy entry must return to the single base URL');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.reload();await page.locator(selector).waitFor();
    assert((await page.locator(selector).innerText()).includes(word),'Refresh restores the selected view');
   }
   assert.deepEqual(errors,[]);
   await context.close();
  }
  console.log('PASS: all seven legacy landing views, consumed fragments, reload persistence and mobile/desktop layouts.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
