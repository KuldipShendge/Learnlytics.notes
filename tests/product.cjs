const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const guideIds = { use: 'gAV7onDGlNo', choose: '1hUTxkkk5jQ' };

const url = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:4173/').href;
const origin = new URL(url).origin;
const output = path.resolve(__dirname, '../screenshots');
const reportFile = path.join(output, 'product-verification.json');
const widths = [360, 390, 430, 768, 1024, 1440];

(async () => {
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(reportFile, JSON.stringify({ status: 'running' }));
  const { curriculum } = await import('../js/ds-curriculum.js');
  assert.equal(curriculum.length, 7);
  assert.equal(curriculum.reduce((sum, module) => sum + module.parts.length, 0), 20);
  assert.equal(curriculum.reduce((sum, module) => sum + module.questions, 0), 3280);
  assert.deepEqual(curriculum.map(module => module.parts.length), [2, 3, 3, 3, 3, 4, 2]);
  assert.deepEqual(curriculum.map(module => module.questions), [490, 510, 540, 500, 480, 500, 260]);
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [], missing = [], external = [], viewports = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
  await context.route('**/*', route => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.origin === 'https://www.youtube-nocookie.com' &&
        Object.values(guideIds).some(id => requestUrl.pathname === `/embed/${id}`)) {
      // Test the integration offline; actual YouTube playback is checked separately.
      return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Guide player test</title>' });
    }
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  async function openProduct() {
    const response = await page.goto(url);
    if (!(await page.locator('body.product-page').count())) {
      await page.locator('#kit-details').click();
    }
    await page.locator('#product-title').waitFor();
    assert.equal(page.url(), url);
    return response;
  }
  async function noOverflow(label) {
    const size = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
    assert(size.scroll <= size.width, `${label}: ${JSON.stringify(size)}`);
  }
  async function closeDialog(id) {
    await page.keyboard.press('Escape');
    await page.locator(id).waitFor({ state: 'hidden' });
  }
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width >= 980 ? 1000 : 844 });
      const response = await openProduct();
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.curriculum-module').count(), 7);
      assert.equal(await page.locator('.module-parts li').count(), 20);
      assert.equal(await page.locator('[data-question-total]').first().textContent(), '3,680+');
      const brand = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        return ['--ink', '--accent', '--paper'].map(token => styles.getPropertyValue(token).trim());
      });
      assert.deepEqual(brand, ['#241525', '#b40982', '#fcfafb']);
      assert.match(await page.locator('.curriculum-total').textContent(), /20 parts\. 60 resources\. One complete kit\./);
      const bodyText = await page.locator('body').innerText();
      assert(!/frequently asked questions|\bPDF\b|\bDOCX\b|7.day refund/i.test(bodyText), 'Excluded product UI found');
      const fonts = await page.locator('#product-title').evaluate(el => ({ family: getComputedStyle(el).fontFamily, available: document.fonts.check('800 20px Manrope') }));
      assert(fonts.family.includes('Manrope') && fonts.available);
      await noOverflow(`${width}px collapsed`);
      assert.equal(await page.locator('#video-dialog').count(), 0, 'Guides play inside their cards');
      for (const id of ['use', 'choose']) {
        const card = page.locator(`#product-${id}-video`);
        const iframe = card.locator('iframe');
        assert.equal(await iframe.count(), 1);
        const source = new URL(await iframe.getAttribute('src'));
        assert.equal(source.origin, 'https://www.youtube-nocookie.com');
        assert.equal(source.pathname, `/embed/${guideIds[id]}`);
        assert.equal(source.searchParams.get('autoplay'), '0');
        assert.equal(source.searchParams.get('mute'), '0');
        assert.equal(await iframe.getAttribute('loading'), 'lazy');
        assert(await iframe.getAttribute('title'));
        const frameBox = await iframe.boundingBox();
        const cardBox = await card.boundingBox();
        assert(frameBox.width >= 200 && frameBox.height >= 200, `${width}px ${id}: player is usable`);
        assert(Math.abs(frameBox.width - cardBox.width) <= 2 && Math.abs(frameBox.height - cardBox.height) <= 2,
          `${width}px ${id}: video must fill the card`);
      }
      for (const summary of await page.locator('.curriculum-module summary').all()) await summary.click();
      assert.equal(await page.locator('.curriculum-module[open]').count(), 7);
      await noOverflow(`${width}px all modules open`);
      for (const summary of await page.locator('.curriculum-module summary').all()) await summary.click();
      await page.locator('.purchase-button').click();
      assert(await page.locator('#checkout-dialog').isVisible());
      assert.match(await page.locator('#checkout-dialog-title').textContent(), /coming soon/);
      await closeDialog('#checkout-dialog');
      await page.locator('.product-sticky [data-checkout]').click();
      assert(await page.locator('#checkout-dialog').isVisible());
      await closeDialog('#checkout-dialog');
      if (width < 900) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.locator('.menu-toggle').click();
        await page.locator('#main-nav a[href="#curriculum"]').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      }
      await openProduct();
      await page.evaluate(async () => {
        document.querySelectorAll('img[src]').forEach(img => img.loading = 'eager');
        await Promise.all([...document.querySelectorAll('img[src]')].map(img => img.decode()));
        await document.fonts.ready;
      });
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: path.join(output, `product-${width}.png`), fullPage: true, style: '.product-sticky { visibility: hidden; }' });
      if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `product-${width}-viewport.png`) });
      viewports.push({ width, overflow: false, curriculum: 'pass', purchasePlaceholder: 'pass' });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await openProduct();
    // Real source previews, sample pagination, and the clearly labelled workbook demo.
    for (const type of ['handbook', 'workbook', 'solutions']) {
      await page.locator(`[data-sample="${type}"]`).click();
      assert.equal(await page.locator(`[data-sample="${type}"]`).getAttribute('aria-selected'), 'true');
      for (let index = 0; index < 3; index++) {
        await page.locator(`[data-sample-index="${index}"]`).click();
        assert.equal(await page.locator('#sample-position').textContent(), `0${index + 1} / 03`);
        if (type === 'workbook') {
          assert(await page.locator('#workbook-preview').isVisible());
          assert.match(await page.locator('#sample-note').textContent(), /Illustrative practice preview/);
        } else {
          await page.locator('#sample-image').evaluate(img => img.decode());
          assert(await page.locator('#sample-image').evaluate(img => img.naturalWidth > 0));
        }
        await noOverflow(`390px ${type} ${index}`);
      }
    }
    await page.locator('.sample-next').click();
    assert.equal(await page.locator('#sample-position').textContent(), '01 / 03');
    await page.locator('.sample-previous').click();
    assert.equal(await page.locator('#sample-position').textContent(), '03 / 03');
    await page.locator('#tab-solutions').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#tab-handbook').getAttribute('aria-selected'), 'true');
    await page.locator('.sample-image-button').click();
    assert(await page.locator('#sample-dialog').isVisible());
    await page.locator('#sample-enlarged').evaluate(img => img.decode());
    await closeDialog('#sample-dialog');
    assert.equal(await page.locator('#support .whatsapp-link').getAttribute('href'), 'https://wa.me/919130631497');
    await page.locator('.choose-section [data-view="home"]').click();
    assert(await page.locator('#compare').evaluate(el => el === document.activeElement));
    await page.locator('[data-kit="scientist"]').click();
    await page.locator('#product-title').waitFor();
    assert.equal(page.url(), url);
    assert(await page.locator('#product-title').isVisible());
    const badAnchors = await page.locator('a[href^="#"]:not([data-view])').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
    assert.deepEqual(badAnchors, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    assert.deepEqual(external, []);
    fs.writeFileSync(reportFile, JSON.stringify({ status: 'pass', viewports, curriculum: { modules: 7, parts: 20, resources: 60, detailedPracticeQuestions: 3280, oldHeadlineQuestions: 3680 }, interactions: ['all curriculum accordions', 'mobile navigation', 'main and sticky purchase placeholders', 'sample tabs and keyboard control', 'sample pagination and zoom', 'both YouTube guides and cleanup', 'homepage product link'], consoleErrors: errors, missingAssets: missing, externalRequests: external }, null, 2));
    console.log('PASS: product at 360, 390, 430, 768, 1024, 1440px; curriculum, samples, YouTube guides, navigation and placeholder checkout.');
  } finally { await browser.close(); }
})().catch(error => {
  fs.writeFileSync(reportFile, JSON.stringify({ status: 'failed', error: error.message }, null, 2));
  console.error(error);
  process.exitCode = 1;
});
