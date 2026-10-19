const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const checkPdfReader = require('./pdf-reader-check.cjs');
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4187/Learnlytics.notes/';
(async () => {
  const { curriculum } = await import('../js/ml-curriculum.js');
  assert.deepEqual(curriculum.map(m=>m.parts.length),[2,3,3,3,3,4,2]);
  assert.equal(curriculum[6].title,'MLOps & Model Deployment');
  assert.deepEqual(curriculum[6].parts.map(p=>p.title),['From Experiment to Deployment','Production Operations']);
  assert.equal(curriculum.reduce((n,m)=>n+m.questions,0),3420);
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const context = await browser.newContext({reducedMotion:'reduce'});
  const page = await context.newPage();
  const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(url).origin?r.continue():r.abort());
  const accent=()=>page.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--accent').trim());
  async function home(){await page.locator('a[data-view="home"]').first().click();}
  async function openKit(kit){await page.locator(`.goal-option:has(input[value="${kit}"])`).click();await page.locator('#kit-details').click();}
  try {
    await page.goto(url);
    for(const width of [360,390,430,768,1024,1440]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await accent(),'#0758e8');
      await openKit('engineer');
      await page.locator('body.engineer-page').waitFor();
      assert.equal(page.url(),url);
      assert.equal(await accent(),'#7040d6');
      assert.match(await page.locator('#product-title').innerText(),/Crack Machine Learning/);
      assert.equal(await page.locator('.price-row > strong').textContent(),'₹499');
      assert.equal(await page.locator('.curriculum-module').count(),7);
      assert.equal(await page.locator('.module-parts > li').count(),20);
      assert.equal(await page.locator('.technology-grid > div').count(),12);
      assert.equal(await page.locator('.testimonial-card').count(),4);
      assert.equal(await page.locator('.testimonial-controls').count(),0);
      assert.match(await page.locator('.hub-library-row').innerText(),/Machine Learning Engineer Kit/);
      assert.match(await page.locator('.learning-toolkit').innerText(),/deploy and monitor/);
      const ids=await page.locator('[id]').evaluateAll(els=>els.map(e=>e.id));
      assert.equal(new Set(ids).size,ids.length);
      assert(await page.locator('#curriculum').evaluate(el=>matchMedia('(min-width:980px)').matches?el.parentElement.classList.contains('product-secondary-content'):el.previousElementSibling.classList.contains('included-section')));
      if(width>=980) assert.deepEqual(await page.locator('.product-secondary-content > section').evaluateAll(els=>els.map(e=>e.className)),['curriculum-section product-section','product-section choose-section','product-section difference-section','product-section audience-section','product-section support-section']);
      await page.locator('.curriculum-module > summary').last().click();
      assert(await page.getByText('Production Operations',{exact:true}).isVisible());
      await page.locator('.curriculum-module > summary').last().click();
      for(const [key,id] of Object.entries({use:'gAV7onDGlNo',choose:'1hUTxkkk5jQ'})) {
        const src=new URL(await page.locator(`[data-inline-video="${key}"] iframe`).getAttribute('src'));
        assert.equal(src.pathname,`/embed/${id}`);assert.equal(src.searchParams.get('autoplay'),'0');
      }
      await page.locator('.book-model').evaluate(img=>img.decode());
      await page.locator('#tab-handbook').click();
      await page.waitForFunction(()=>document.querySelector('.sample-frame').getAttribute('aria-busy')==='false');
      if(width===390) await checkPdfReader(page,{filename:'eda-handbook.pdf',count:32});
      await page.locator('.purchase-button').click();
      assert(await page.locator('#checkout-dialog').isVisible());await page.keyboard.press('Escape');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}px`);
      if([390,1440].includes(width)) {
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        await page.screenshot({path:`screenshots/engineer-${width}-viewport.png`});
        await page.screenshot({path:`screenshots/engineer-${width}.png`,fullPage:true});
        await page.locator('#curriculum').screenshot({path:`screenshots/engineer-curriculum-${width}.png`});
      }
      await home();assert.equal(await accent(),'#0758e8');
      for(const kit of ['analyst','scientist']) {await openKit(kit);assert.equal(await accent(),'#0758e8');await home();}
    }
    await openKit('engineer');await page.reload();await page.locator('body.engineer-page').waitFor();
    assert.equal(await accent(),'#7040d6');await home();await page.goBack();await page.locator('body.engineer-page').waitFor();
    await page.goForward();await page.locator('body.home-page').waitFor();
    assert.equal(page.url(),url);assert.equal(await accent(),'#0758e8');
    assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
    console.log('PASS: ML at six widths; curriculum, PDF reader, videos, reviews, purchase dialog, history and isolated theme.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
