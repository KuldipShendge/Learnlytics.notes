const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4198/';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  // No external requests, purchases, or resource submissions during QA.
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [], missing = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
  await page.clock.install({ time: new Date('2026-10-30T10:00:00+05:30') });
  try {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal((await page.goto(new URL('project-da', base).href)).status(), 200);
      await page.locator('#project-title').waitFor();
      await page.locator('.book-model').evaluate(img => img.decode());
      assert.equal(await page.title(), 'Project Explanation Toolkit — Data Analyst Edition | LearnLytics');
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://www.learnlyticshandbook.shop/project-da');
      assert.equal(await page.locator('.toolkit-project-group li').count(), 10);
      assert.equal(await page.locator('.toolkit-chapters li').count(), 16);
      assert.equal(await page.locator('.toolkit-chapters details[open]').count(), 0);
      assert.deepEqual(await page.locator('[data-project-price]').allTextContents(), ['₹199', '₹199']);
      assert.equal(await page.locator('[data-project-download][href], [data-project-buy][href]').count(), 0);
      assert(await page.locator('[data-project-download]').first().evaluate(el => el.getBoundingClientRect().bottom < innerHeight));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      for (const summary of await page.locator('.toolkit-chapters summary').all()) {
        await summary.focus();
        await page.keyboard.press('Enter');
        assert(await summary.evaluate(el => el.parentElement.open));
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.keyboard.press('Enter');
      }
      if (width === 390 || width === 1440) {
        await page.evaluate(() => { document.activeElement.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
        await page.screenshot({ path: `screenshots/project-da-${width}.png`, fullPage: true });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: `screenshots/project-da-${width}-hero.png` });
      }
      await page.reload();
      await page.locator('#project-title').waitFor();
      if (width === 390) {
        await page.locator('.menu-toggle').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
        await page.locator('#main-nav a[href="#chapters"]').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      }
    }
    await page.clock.setSystemTime(new Date('2026-11-08T23:59:59+05:30'));
    await page.reload();
    await page.locator('#project-title').waitFor();
    await page.clock.runFor(1100);
    assert.deepEqual(await page.locator('[data-project-price]').allTextContents(), ['₹499', '₹499']);
    assert.equal(await page.locator('[data-project-promo]:visible, [data-project-regular]:visible').count(), 0);
    assert.match(await page.locator('[data-project-buy="final"]').innerText(), /₹499/);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(new URL('Career-Resources', base).href);
      await page.locator('.resource-card').last().waitFor();
      assert.equal(await page.locator('.resource-card').count(), 6);
      assert.equal(await page.locator('[data-resource]').count(), 5);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.locator('.resource-card a[data-view="project"]').click();
      await page.locator('#project-title').waitFor();
      assert.equal(new URL(page.url()).pathname, '/project-da');
      await page.goto(new URL('data-analyst', base).href);
      await page.locator('.toolkit-card-link').waitFor();
      assert.equal(await page.locator('.learning-toolkit').count(), 1);
      await page.locator('.toolkit-card-link').focus();
      await page.keyboard.press('Enter');
      await page.locator('#project-title').waitFor();
      await page.goBack();
      await page.locator('.toolkit-card-link').waitFor();
      // Hit-test the artwork: its stretched native link should receive the click.
      await page.locator('.learning-toolkit .toolkit-product img').scrollIntoViewIfNeeded();
      const image = await page.locator('.learning-toolkit .toolkit-product img').boundingBox();
      await page.mouse.click(image.x + image.width / 2, image.y + image.height / 2);
      await page.locator('#project-title').waitFor();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    console.log('Toolkit browser checks passed: 5 widths, direct load/refresh, keyboard accordions, live expiry, mobile menu and both entry links.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
