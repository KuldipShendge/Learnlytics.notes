const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const origin = new URL(url).origin;

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const cdp = await context.newCDPSession(page);
  async function open(view) {
    await page.goto(url);
    if (!await page.locator('body.home-page').count()) await page.locator('[data-view="home"]').first().click();
    if (view === 'analyst') await page.locator('.goal-option:has(input[value="analyst"])').click();
    await page.locator('#kit-details').click();
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(0, 0);
  }
  try {
    for (const view of ['scientist', 'analyst']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await open(view);
      const track = page.locator('#testimonial-list');
      const cards = track.locator('.testimonial-card');
      assert.equal(await cards.count(), 4);
      assert.deepEqual(await cards.evaluateAll(els => els.map(el => el.dataset.channel)), ['whatsapp', 'linkedin', 'gmail', 'whatsapp']);
      assert(await page.locator('.product-testimonials').evaluate(el => el.nextElementSibling.classList.contains('product-closing')));
      assert.equal(await page.locator('.support-section .whatsapp-link').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(21, 128, 61)');
      await track.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('#testimonial-list').dataset.autoSliding === 'true');
      await page.waitForFunction(() => document.querySelector('#testimonial-list').scrollLeft > 100, null, { timeout: 7000 });
      await page.locator('.testimonial-autoplay').click();
      assert.equal(await track.getAttribute('data-auto-sliding'), 'false');
      await page.locator('.testimonial-dot').first().click();
      await page.waitForFunction(() => document.querySelector('#testimonial-list').scrollLeft < 2);

      // Real touch input verifies the native horizontal swipe, not a synthetic scrollTo.
      const box = await track.boundingBox();
      const startX = box.x + box.width - 45, endX = box.x + 35, y = box.y + box.height / 2;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y }] });
      for (let step = 1; step <= 8; step++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: startX + (endX - startX) * step / 8, y }] });
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForFunction(() => document.querySelector('#testimonial-list').scrollLeft > 100);
      await page.locator('.testimonial-dot').last().click();
      await page.waitForFunction(() => document.querySelector('.testimonial-dot:last-child').getAttribute('aria-current') === 'true');
      await page.locator('.product-testimonials').screenshot({ path: `screenshots/${view}-reviews-mobile.png` });
      await page.locator('.testimonial-autoplay').click();
      await page.evaluate(() => document.activeElement.blur());
      await page.mouse.move(0, 0);
      await page.waitForFunction(() => document.querySelector('#testimonial-list').dataset.autoSliding === 'true');
      await page.locator('[data-view="home"]').first().click();
      await page.goBack();
      await page.locator('#testimonial-list').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('#testimonial-list').dataset.autoSliding === 'true');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => document.querySelector('#testimonial-list').dataset.autoSliding === 'false');
      assert(await page.locator('.testimonial-autoplay').isHidden());

      for (const width of [360, 430, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.locator('.book-model').scrollIntoViewIfNeeded();
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (width === 1440) {
          assert.equal(Math.round((await page.locator('.book-model').boundingBox()).width), 340);
          const boxes = await cards.evaluateAll(els => els.map(el => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y })));
          assert(boxes.every(box => box.y === boxes[0].y), 'Desktop reviews must share one row');
          assert.equal(await track.getAttribute('data-auto-sliding'), 'false');
          await page.locator('.product-testimonials').screenshot({ path: `screenshots/${view}-reviews-desktop.png` });
          await page.locator('.book-model').scrollIntoViewIfNeeded();
          await page.screenshot({ path: `screenshots/${view}-larger-book-desktop.png` });
        }
      }
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      console.log(`PASS: ${view}: larger cover, green WhatsApp, four desktop cards, mobile auto/manual swipe, pause/resume, revisit and reduced motion`);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
