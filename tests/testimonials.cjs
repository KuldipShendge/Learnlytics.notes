const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
(async () => {
  fs.mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.route('**/*', route => new URL(route.request().url()).origin === new URL(url).origin ? route.continue() : route.abort());
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  try {
    for(const view of ['scientist','analyst','engineer','complete']) {
      await page.goto(url);
      if(!await page.locator('body.home-page').count()) await page.locator('[data-view="home"]').first().click();
      await page.locator(`input[value="${view}"]`).check();
      await page.locator('#kit-details').click();
      await page.evaluate(()=>document.fonts.ready);
      for(const width of [360,390,430,768,1024,1440,390]) {
        await page.setViewportSize({width,height:1000});
        const grid=page.locator('#testimonial-list');
        const cards=grid.locator('.testimonial-card');
        assert.equal(await cards.count(),4);
        assert.deepEqual(await cards.evaluateAll(els=>els.map(e=>e.dataset.channel)),['whatsapp','linkedin','gmail','whatsapp']);
        assert.equal(await page.locator('.testimonial-controls').isVisible(),width<560);
        assert.equal(await grid.getAttribute('tabindex'),null);
        assert.equal(await grid.getAttribute('data-auto-sliding'),null);
        assert.equal(await grid.evaluate(el=>el.scrollWidth>el.clientWidth+1),width<560);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        const boxes=await cards.evaluateAll(els=>els.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,bottom:b.bottom};}));
        if(width<560) {
          assert(boxes.every((b,i)=>Math.abs(b.y-boxes[0].y)<1&&(!i||b.x>boxes[i-1].x)),'Mobile cards must form a horizontal slider');
          assert(Math.abs((await cards.first().boundingBox()).width-(await grid.boundingBox()).width)<2,'Exactly one card fills the viewport');
          await page.locator('.testimonial-dots button').nth(2).click();
          await page.waitForFunction(()=>document.querySelectorAll('.testimonial-dots button')[2].getAttribute('aria-current')==='true');
          await page.locator('.testimonial-dots button').first().click();
        }
        else {
          assert(Math.abs(boxes[0].y-boxes[1].y)<1&&Math.abs(boxes[2].y-boxes[3].y)<1,'Two cards per row');
          assert(boxes[2].y>boxes[0].bottom&&boxes[1].x>boxes[0].x,'Two distinct rows');
        }
        assert.equal(await page.locator('.testimonial-read-more').innerText(),'Read More');
        assert.equal(await page.locator('.testimonial-read-more a,.testimonial-read-more button').count(),0);
        if(width>=980) {
          const layout=await page.evaluate(()=>{
            const reviews=document.querySelector('.product-testimonials').getBoundingClientRect();
            const closing=document.querySelector('.product-closing').getBoundingClientRect();
            const tools=document.querySelector('.tools-section').getBoundingClientRect();
            const help=document.querySelector('.support-section').getBoundingClientRect();
            return {reviewGap:closing.top-reviews.bottom,closingGap:closing.top-Math.max(reviews.bottom,tools.bottom),toolsGap:tools.top-help.bottom,order:[...document.querySelector('.product-secondary-content').children].map(el=>el.id||[...el.classList].find(n=>n!=='product-section'))};
          });
          assert.deepEqual(layout.order,['curriculum','choose-section','difference-section','audience-section','support']);
          assert(Math.abs(layout.toolsGap-39)<2);
          assert(layout.closingGap>=0&&layout.closingGap<=60,'No extra space before closing CTA');
          console.log(`${view} ${width}px: reviews-to-closing gap ${Math.round(layout.reviewGap)}px`);
        }
        if(width===1440||width===390) {
          await page.locator('.product-testimonials').screenshot({path:`screenshots/${view}-static-reviews-${width}.png`,style:'.site-header,.product-sticky,.skip-link {visibility:hidden}'});
          if(width===1440) {
            await page.evaluate(()=>scrollTo({top:document.querySelector('.product-testimonials').getBoundingClientRect().top+scrollY-110,behavior:'instant'}));
            await page.screenshot({path:`screenshots/${view}-reviews-closing-${width}.png`});
          }
        }
      }
      await page.locator('[data-view="home"]').first().click();
      await page.goBack();
      assert.equal(await page.locator('.testimonial-card').count(),4);
      assert.equal(await page.locator('.testimonial-controls').count(),1);
      for (const width of [390,1440]) {
        await page.setViewportSize({width,height:900});
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        await page.waitForFunction(()=>!document.querySelector('.product-sticky').classList.contains('is-visible'));
        assert(await page.locator('.product-sticky').evaluate(el=>el.inert));
        await page.evaluate(()=>scrollTo({top:document.querySelector('.product-hero').getBoundingClientRect().bottom+scrollY+20,behavior:'instant'}));
        await page.waitForFunction(()=>document.querySelector('.product-sticky').classList.contains('is-visible'));
        assert.equal(await page.locator('.product-sticky').evaluate(el=>el.inert),false);
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        await page.waitForFunction(()=>!document.querySelector('.product-sticky').classList.contains('is-visible'));
      }
      console.log(`PASS: ${view}: mobile slider, desktop grid, sidebar spacing, scroll-triggered purchase bar and revisit.`);
    }
    await page.setViewportSize({width:390,height:900});
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.locator('.product-testimonials').scrollIntoViewIfNeeded();
    await page.evaluate(()=>document.activeElement.blur());
    await page.waitForFunction(()=>document.querySelectorAll('.testimonial-dots button')[1].getAttribute('aria-current')==='true',{},{timeout:7000});
    await page.locator('.testimonial-autoplay').click();
    const pausedIndex=await page.locator('.testimonial-dots button[aria-current="true"]').getAttribute('aria-label');
    await page.evaluate(()=>document.activeElement.blur());
    await page.waitForTimeout(5100);
    assert.equal(await page.locator('.testimonial-dots button[aria-current="true"]').getAttribute('aria-label'),pausedIndex);
    await page.locator('.product-testimonials').screenshot({path:'screenshots/mobile-review-slider.png'});
    console.log('PASS: automatic advancement and pause control.');
    assert.deepEqual(errors,[]);
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
