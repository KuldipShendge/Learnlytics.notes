const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4187/Learnlytics.notes/';
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => new URL(route.request().url()).origin === new URL(url).origin ? route.continue() : route.abort());
  try {
    await page.goto(url);
    assert.equal(await page.locator('a[data-view="reviews"]').count(), 0);
    for (const kit of ['analyst', 'scientist', 'engineer', 'complete']) {
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 950 });
        await page.locator(`input[value="${kit}"]`).check();
        await page.locator('#kit-details').click();
        assert.equal(await page.locator('#main-nav a[href="#samples"]').count(), 0);
        assert.equal(await page.locator('#main-nav .career-nav .free-tag').innerText(), 'Free');
        assert.equal(await page.locator('#main-nav a[data-view="reviews"]').count(), 0);
        if (width === 390) await page.locator('.menu-toggle').click();
        await page.locator('#main-nav .career-nav').click();
        await page.waitForSelector('body.career-page');
        await page.goBack();
        await page.waitForSelector(`body.${kit === 'complete' ? 'complete' : kit}-page`);
        await page.locator('.testimonial-read-more').click();
        await page.waitForSelector('body.reviews-page');
        assert.equal(await page.locator('.learner-review').count(), 10);
        assert.equal(await page.locator('.review-person strong').first().innerText(), 'Rahul S.');
        assert.equal(await page.locator('.review-stars[aria-label="4 out of 5 stars"]').count(), 1);
        assert.equal(await page.locator('#main-nav a[data-view="reviews"],footer a[data-view="reviews"]').count(), 0);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.equal(await page.locator('#reviews-back').getAttribute('data-view'), kit);
        if (kit === 'analyst') await page.screenshot({ path: `screenshots/reviews-page-${width}.png`, fullPage: true });
        await page.locator('#reviews-back').click();
        assert.equal(await page.locator('.testimonial-read-more').count(), 1);
        assert.equal(await page.evaluate(() => history.state.learnlytics.view), kit);
        await page.locator('[data-view="home"]').first().click();
      }
      console.log(`PASS: ${kit}: Career Resources navigation, Read More reviews page, return to kit, desktop/mobile.`);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
