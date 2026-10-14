// Run at / and at /Learnlytics.notes/ to catch project-hosting path regressions.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:4173/').href;

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [], missing = [], documents = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
      page.on('request', request => { if (request.resourceType() === 'document') documents.push(request.url()); });
      await context.route('**/*', route => new URL(route.request().url()).origin === new URL(url).origin
        ? route.continue() : route.abort());
      async function checkView(selector) {
        await page.locator(selector).waitFor();
        assert.equal(page.url(), url, 'Navigation must preserve the complete URL');
        assert.equal(await page.locator('main').count(), 1);
        const duplicates = await page.locator('[id]').evaluateAll(elements => {
          const ids = elements.map(element => element.id);
          return ids.filter((id, index) => ids.indexOf(id) !== index);
        });
        assert.deepEqual(duplicates, [], 'Inactive views must not leave duplicate IDs');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
      async function openAbout() {
        if (width < 900) await page.locator('.menu-toggle').click();
        await page.locator('#main-nav [data-view="about"]').click();
        await checkView('#about-title');
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      }

      assert.equal((await page.goto(url)).status(), 200);
      await page.locator('#kit-details').click();
      await checkView('#product-title');
      assert.match(await page.title(), /Data Scientist/);
      await page.goBack();
      await checkView('#hero-title');
      await page.goForward();
      await checkView('#product-title');
      await openAbout();
      await page.locator('[data-view="scientist"]').click();
      await checkView('#product-title');
      assert(await page.locator('#samples').evaluate(el => el === document.activeElement));
      assert.equal(documents.length, 1, 'View changes must not load another document');

      // Refresh restores the active view at the same static entry point.
      await page.reload();
      await checkView('#product-title');
      assert.equal(documents.length, 2);
      await page.locator('.breadcrumbs [data-view="home"]').first().click();
      await checkView('#hero-title');
      for (let repeat = 0; repeat < 3; repeat++) {
        await page.locator('[data-kit="scientist"]').click();
        await checkView('#product-title');
        await page.locator('.purchase-button').click();
        assert(await page.locator('#checkout-dialog').isVisible());
        await page.keyboard.press('Escape');
        await page.locator('#checkout-dialog').waitFor({ state: 'hidden' });
        await openAbout();
        await page.locator('.about-hero [data-view="home"]').click();
        await checkView('#hero-title');
        assert(await page.locator('#career-goal').evaluate(el => el === document.activeElement));
      }
      // Other kit dialogs still work after the DS navigation handler is removed.
      await page.locator('.goal-option:has(input[value="analyst"])').click();
      await page.locator('#kit-details').click();
      assert(await page.locator('#kit-dialog').isVisible());
      await page.keyboard.press('Escape');
      await page.locator('#kit-dialog').waitFor({ state: 'hidden' });
      await page.locator('.goal-option:has(input[value="scientist"])').click();
      await page.locator('#kit-details').click();
      await checkView('#product-title');
      assert.equal(documents.length, 2);
      assert.deepEqual(errors, []);
      assert.deepEqual(missing, []);
      await context.close();
    }
    console.log(`PASS: single-URL navigation, Back/Forward, refresh, repeat visits and assets at ${url}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
