// Browser acceptance checks. Install Playwright separately or use NODE_PATH.
// Run against the local preview; no external requests are allowed during QA.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const guideIds = { use: 'gAV7onDGlNo', choose: '1hUTxkkk5jQ' };

const url = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:4173/').href;
const output = path.resolve(__dirname, '../screenshots');
const widths = [360, 390, 430, 768, 1024, 1440];
const kits = { analyst: 'Crack Data & BI Analyst', scientist: 'Crack Data Scientist & Gen AI', engineer: 'Crack Machine Learning', complete: 'One Kit. More Possibilities.' };

(async () => {
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({ status: 'running' }, null, 2));
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [], missing = [], external = [], report = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
  await context.route('**/*', route => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.origin === 'https://www.youtube-nocookie.com' &&
        Object.values(guideIds).some(id => requestUrl.pathname === `/embed/${id}`)) {
      // Test the integration offline; actual YouTube playback is checked separately.
      return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Guide player test</title>' });
    }
    if (new URL(route.request().url()).origin === new URL(url).origin) return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  async function openHome() {
    const response = await page.goto(url);
    if (!(await page.locator('body.home-page').count())) {
      await page.locator('a[data-view="home"]').first().click();
    }
    return response;
  }
  async function noOverflow(label) {
    const dimensions = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert(dimensions.page <= dimensions.viewport, `${label}: overflow ${JSON.stringify(dimensions)}`);
  }
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width >= 900 ? 1000 : 844 });
      const response = await openHome();
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.match(await page.locator('#recommended-title').innerText(), /Crack Data Scientist\s*& Gen AI/);
      assert(await page.locator('input[value="scientist"]').isChecked());
      for (const [id, youtubeId] of Object.entries(guideIds)) {
        const frame = page.locator(`[data-inline-video="${id}"] iframe`);
        assert.equal(await frame.count(), 1);
        const source = new URL(await frame.getAttribute('src'));
        assert.equal(source.pathname, `/embed/${youtubeId}`);
        assert.equal(source.searchParams.get('autoplay'), '0');
        assert.equal(source.searchParams.get('mute'), '0');
        assert.equal(source.searchParams.get('playsinline'), '1');
        assert.equal(await frame.getAttribute('loading'), 'lazy');
        const card = await page.locator(`.guide-card:has([data-inline-video="${id}"]) .video-poster`).boundingBox();
        const player = await frame.boundingBox();
        assert(player.width >= 200 && player.height >= 200, 'Player controls need usable space');
        assert(Math.abs(player.width - card.width) <= 1, 'Card and video must have matching widths');
        assert(Math.abs(player.height - card.height) <= 1, 'Card and video must have matching heights');
        if (width >= 900) assert(player.x >= card.x + card.width, 'Video must be right of the card');
        else assert(player.y >= card.y + card.height, 'Video must stack below the card');
      }
      assert.equal(await page.locator('#use-title').innerText(), 'How to use\nyour kit');
      assert.deepEqual(await page.locator('.poster-books span').allTextContents(), ['Learn', 'Practice', 'Improve']);
      await noOverflow(`${width}px initial`);
      for (const [id, title] of Object.entries(kits)) {
        await page.locator(`.goal-option:has(input[value="${id}"])`).click();
        assert.equal(await page.locator('#recommended-title').textContent(), title);
        assert.equal(await page.locator('#kit-price').textContent(), id === 'complete' ? '₹899' : id === 'analyst' ? '₹399' : '₹499');
        await noOverflow(`${width}px ${id}`);
        await page.locator('#kit-details').click();
        if (id === 'scientist' || id === 'analyst') {
          await page.locator('#product-title').waitFor();
          assert.equal(page.url(), url);
          assert(await page.locator('#product-title').isVisible());
          assert.equal(await page.locator('body.analyst-page').count(), id === 'analyst' ? 1 : 0);
          await openHome();
          continue;
        }
        assert(await page.locator('#kit-dialog').isVisible());
        assert.equal(await page.locator('#kit-dialog-title').textContent(), title);
        const dialogFits = await page.locator('#kit-dialog').evaluate(el => el.scrollWidth <= el.clientWidth);
        assert(dialogFits, `${width}px ${id} dialog overflow`);
        await page.keyboard.press('Escape');
        assert(!(await page.locator('#kit-dialog').isVisible()));
        assert(await page.locator('#kit-details').evaluate(el => el === document.activeElement));
      }
      if (width < 900) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.locator('.menu-toggle').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
        await page.locator('#main-nav a[href="#inside"]').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      }
      // Capture the page in its default state, with lazy assets fully loaded.
      await openHome();
      await page.evaluate(async () => {
        document.querySelectorAll('img').forEach(img => img.loading = 'eager');
        await Promise.all([...document.images].map(img => img.decode()));
        await document.fonts.ready;
      });
      await page.screenshot({ path: path.join(output, `homepage-${width}.png`), fullPage: true });
      if (width === 390 || width === 1440) await page.screenshot({ path: path.join(output, `homepage-${width}-viewport.png`) });
      report.push({ width, overflow: false, allFourKits: 'pass', dialogs: 'pass', screenshot: `homepage-${width}.png` });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await openHome();
    // Keyboard radio selection and comparison navigation.
    await page.locator('input[value="scientist"]').focus();
    await page.keyboard.press('ArrowRight');
    assert(await page.locator('input[value="engineer"]').isChecked());
    await page.locator('[data-kit="complete"]').click();
    assert(await page.locator('input[value="complete"]').isChecked());
    await page.locator('#kit-details').click();
    await page.locator('#explore-materials').click();
    assert(!(await page.locator('#kit-dialog').isVisible()));
    assert(await page.locator('#inside-title').evaluate(el => el === document.activeElement));
    assert.equal(await page.locator('#video-dialog').count(), 0);
    for (const trigger of await page.locator('[data-video]').all()) {
      const id = await trigger.getAttribute('data-video');
      await trigger.click();
      const iframe = page.locator(`[data-inline-video="${id}"] iframe`);
      assert.equal(await iframe.count(), 1);
      const source = new URL(await iframe.getAttribute('src'));
      assert.equal(source.pathname, `/embed/${guideIds[id]}`);
      assert.equal(source.searchParams.get('autoplay'), '1');
      assert.equal(source.searchParams.get('mute'), '0');
      assert.equal(await iframe.getAttribute('referrerpolicy'), 'strict-origin-when-cross-origin');
      assert.equal(await page.locator(`.guide-card:has([data-inline-video="${id}"]) .guide-video-note a`).getAttribute('href'), `https://youtu.be/${guideIds[id]}`);
      const otherId = id === 'use' ? 'choose' : 'use';
      const otherSource = new URL(await page.locator(`[data-inline-video="${otherId}"] iframe`).getAttribute('src'));
      assert.equal(otherSource.searchParams.get('autoplay'), '0', 'Other guide stops when a card starts playback');
      assert.equal(await page.locator('.demo-stage').count(), 0);
      assert(await iframe.evaluate(el => el === document.activeElement));
      assert.equal(page.url(), url, 'Playing an inline guide must preserve the URL');
      await noOverflow(`390px ${id} inline video`);
      await page.screenshot({ path: path.join(output, `guide-${id}-390.png`) });
    }
    await page.locator('.faq-list summary').first().click();
    assert(await page.locator('.faq-list details').first().evaluate(el => el.open));
    await page.locator('.faq-list summary').first().click();
    assert(!(await page.locator('.faq-list details').first().evaluate(el => el.open)));
    const invalidLinks = await page.locator('a[href^="#"]:not([data-view])').evaluateAll(links => links.filter(link => link.hash && !document.getElementById(link.hash.slice(1))).map(link => link.getAttribute('href')));
    assert.deepEqual(invalidLinks, []);
    const brokenImages = await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).map(img => img.src));
    assert.deepEqual(brokenImages, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    assert.deepEqual(external, []);
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({ status: 'pass', viewports: report, interactions: ['keyboard career selection', 'comparison card navigation', 'mobile menu', 'kit dialogs and focus restoration', 'resource navigation', 'inline guide layout, autoplay off, play buttons and focus', 'FAQ accordion'], consoleErrors: errors, missingAssets: missing, externalRequests: external }, null, 2));
    console.log(`PASS: ${widths.join(', ')}px. All kit states, dialogs, menus, guides, FAQs, assets and overflow checks passed.`);
  } finally { await browser.close(); }
})().catch(error => {
  fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({ status: 'failed', error: error.message }, null, 2));
  console.error(error);
  process.exitCode = 1;
});
