const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const checkPdfReader = require('./pdf-reader-check.cjs');
const url = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:4173/').href;
const origin = new URL(url).origin;
const output = path.resolve(__dirname, '../screenshots');
(async () => {
  const { curriculum, productOverview } = await import('../js/da-curriculum.js');
  assert.equal(curriculum.length, 8);
  assert.deepEqual(curriculum.map(module => module.units.length), [12,10,10,14,10,8,6,7]);
  assert.equal(curriculum.reduce((sum,module) => sum+module.topics,0), 637);
  assert.equal(productOverview.units,77);
  const browser = await chromium.launch({executablePath:process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const context = await browser.newContext({reducedMotion:'reduce'});
  const page = await context.newPage();
  const errors=[], missing=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{ if(response.status()>=400) missing.push(response.url()); });
  await context.route('**/*',route=>{
    const source = new URL(route.request().url());
    if(source.origin==='https://www.youtube-nocookie.com') return route.fulfill({contentType:'text/html',body:'<!doctype html><title>Guide</title>'});
    return source.origin===origin ? route.continue() : route.abort();
  });
  async function openAnalyst() {
    await page.goto(url);
    if(!await page.locator('body.home-page').count()) await page.locator('[data-view="home"]').first().click();
    await page.locator('.goal-option:has(input[value="analyst"])').click();
    await page.locator('#kit-details').click();
    await page.locator('body.analyst-page').waitFor();
    assert.equal(page.url(),url);
  }
  try {
    fs.mkdirSync(output,{recursive:true});
    for(const width of [360,390,430,768,1024,1440]) {
      await page.setViewportSize({width,height:width>=980?1000:844});
      await openAnalyst();
      assert.match(await page.locator('#product-title').innerText(),/Data & BI Analyst/);
      assert.equal(await page.locator('.price-row > strong').textContent(),'₹399');
      assert.equal(await page.locator('.product-sticky strong').textContent(),'₹399');
      assert.equal(await page.locator('[data-question-total]').first().textContent(),'2,200+');
      assert.equal(await page.locator('.curriculum-module').count(),8);
      assert.equal(await page.locator('.technology-grid > div').count(),12);
      assert.equal(await page.locator('.material-confidence').count(),0);
      assert.equal(await page.locator('.curriculum-unit').count(),77);
      assert.equal(await page.locator('.curriculum-topics > li').count(),637);
      assert(await page.locator('#curriculum').evaluate((el,desktop)=>desktop
        ? el.parentElement.classList.contains('product-secondary-content')
        : el.previousElementSibling.classList.contains('included-section') && el.nextElementSibling.matches('[data-learning-experience]'),width>=980));
      assert.equal(await page.locator('.testimonial-card').count(),4);
      assert.deepEqual(await page.locator('.testimonial-person strong').allTextContents(),['Rahul Verma','Sneha Iyer','Ankit Sharma','Pooja Nair']);
      assert.match(await page.locator('.testimonial-card blockquote').first().textContent(),/scenario based questions/);
      assert(await page.locator('.product-testimonials').evaluate(el=>el.parentElement.classList.contains('product-primary') && el.previousElementSibling.lastElementChild.classList.contains('audience-section')));
      for(const [key,id] of Object.entries({use:'gAV7onDGlNo',choose:'1hUTxkkk5jQ'})) {
        const source = new URL(await page.locator(`[data-inline-video="${key}"] iframe`).getAttribute('src'));
        assert.equal(source.pathname,`/embed/${id}`);
        assert.equal(source.searchParams.get('autoplay'),'0');
      }
      await page.locator('.curriculum-module > summary').first().click();
      await page.locator('.curriculum-unit > summary').first().click();
      assert(await page.locator('.curriculum-topics').first().isVisible());
      assert.match(await page.locator('.curriculum-topics').first().innerText(),/Mean, Median & Mode/);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.locator('.curriculum-module > summary').first().click();
      await page.locator('.purchase-button').click();
      assert(await page.locator('#checkout-dialog').isVisible());
      await page.keyboard.press('Escape');
      await page.locator('#tab-handbook').click();
      await page.waitForFunction(()=>document.querySelector('#sample-pdf-page').dataset.pdf==='eda-handbook.pdf' && document.querySelector('.sample-frame').getAttribute('aria-busy')==='false');
      for(const [type,file] of Object.entries({workbook:'eda-practice-workbook.pdf',solutions:'eda-solution-manual.pdf'})) {
        await page.locator(`#tab-${type}`).click();
        await page.waitForFunction(file=>document.querySelector('#sample-pdf-page').dataset.pdf===file && document.querySelector('.sample-frame').getAttribute('aria-busy')==='false',file);
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.locator('.book-model').evaluate(img=>img.decode());
      if ([390,1440].includes(width)) await checkPdfReader(page, { filename:'eda-solution-manual.pdf', count:11 });
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:path.join(output,`analyst-${width}.png`),fullPage:true,style:'.product-sticky {visibility:hidden}'});
      if([390,1440].includes(width)) await page.screenshot({path:path.join(output,`analyst-${width}-viewport.png`)});
      await page.locator('.breadcrumbs [data-view="home"]').first().click();
      await page.locator('.goal-option:has(input[value="scientist"])').click();
      await page.locator('#kit-details').click();
      assert.equal(await page.locator('.curriculum-module').count(),7);
      assert.equal(await page.locator('.testimonial-card').count(),4);
      assert.match(await page.locator('.testimonial-card blockquote').first().textContent(),/machine learning scenario questions/);
      assert.equal(await page.locator('.price-row > strong').textContent(),'₹499');
    }
    assert.deepEqual(errors,[]);
    assert.deepEqual(missing,[]);
    console.log('PASS: DA at 360, 390, 430, 768, 1024, 1440px; source curriculum, shared PDFs/videos, reviews placement and DS/DA switching.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
