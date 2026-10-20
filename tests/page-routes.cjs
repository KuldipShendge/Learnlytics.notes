const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4196/';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
  });
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin
        ? route.continue() : route.abort());
      const page = await context.newPage();
      const errors = [], missing = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
      for (const [slug, view, selector] of [
        ['data-analyst', 'analyst', '#product-title'],
        ['data-scientist-gen-ai', 'scientist', '#product-title'],
        ['machine-learning-engineer', 'engineer', '#product-title'],
        ['all-in-one-combo', 'complete', '#product-title'],
        ['Career-Resources', 'resources', '#career-resources-title'],
        ['about-us', 'about', '#about-title'],
        ['learner-reviews', 'reviews', '#reviews-title'],
      ]) {
        const target = new URL(slug, base).href;
        assert.equal((await page.goto(target)).status(), 200);
        await page.locator(selector).waitFor();
        assert.equal(await page.evaluate(() => history.state.learnlytics.view), view);
        assert.equal(page.url(), target);
        assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `https://www.learnlyticshandbook.shop/${slug}`);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        for (const img of await page.locator('.brand img').all()) await img.evaluate(el => el.decode());
        const hub = page.locator('.header-llh-link');
        assert.equal(await hub.evaluate(el => el.href), new URL('learnlytics-learning-hub', base).href);
        await page.reload();
        await page.locator(selector).waitFor();
        assert.equal(await page.evaluate(() => history.state.learnlytics.view), view);
      }
      // Section anchors, campaign queries, real link targets, and fresh-tab navigation.
      await page.goto(new URL('data-scientist-gen-ai?utm_source=test#samples', base).href);
      await page.locator('#samples').waitFor();
      assert.equal(await page.evaluate(() => history.state.learnlytics.section), 'samples');
      await page.locator('.breadcrumbs [data-view="home"]').first().click();
      assert.equal(new URL(page.url()).pathname, new URL(base).pathname);
      assert.equal(new URL(page.url()).search, '?utm_source=test');
      await page.goBack();
      await page.locator('#product-title').waitFor();
      assert.equal(new URL(page.url()).hash, '#samples');
      const link = page.locator('a[data-view="resources"]').first();
      const fresh = await context.newPage();
      await fresh.goto(await link.evaluate(el => el.href));
      await fresh.locator('#career-resources-title').waitFor();
      await fresh.close();
      await page.goto(new URL('learnlytics-learning-hub', base).href);
      await page.locator('#llh-main').waitFor();
      assert((await page.locator('#llh-message').innerText()).includes('setup'));
      assert.equal(await page.locator('#llh-demo-login').count(), 0);
      await page.reload();
      await page.locator('#llh-main').waitFor();
      assert.deepEqual(errors, []);
      assert.deepEqual(missing, []);
      for (const path of ['no-such-page', 'api/secret', 'supabase/migrations/test.sql']) {
        assert.equal((await context.request.get(new URL(path, base).href)).status(), 404);
      }
      assert.equal((await context.request.get(new URL('data-analyst/', base).href, { maxRedirects: 0 })).status(), 308);
      const legacy = await context.request.get(new URL('course-bundles/machine-learning-interview-kit', base).href, { maxRedirects: 0 });
      assert.equal(legacy.status(), 308);
      assert.equal(legacy.headers().location, new URL('machine-learning-engineer', base).pathname);
      await context.close();
    }
    console.log(`PASS: direct routes, reloads, new tabs, section/query history, LLH, redirects, 404s and responsive layouts at ${base}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
