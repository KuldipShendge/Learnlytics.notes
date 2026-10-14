// Browser acceptance checks. Install Playwright separately or use NODE_PATH.
// Run against the local preview; no external requests are allowed during QA.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
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
    if (new URL(route.request().url()).origin === url) return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  async function noOverflow(label) {
    const dimensions = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert(dimensions.page <= dimensions.viewport, `${label}: overflow ${JSON.stringify(dimensions)}`);
  }
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width >= 900 ? 1000 : 844 });
      const response = await page.goto(url);
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.match(await page.locator('#recommended-title').innerText(), /Crack Data Scientist\s*& Gen AI/);
      assert(await page.locator('input[value="scientist"]').isChecked());
      await noOverflow(`${width}px initial`);
      for (const [id, title] of Object.entries(kits)) {
        await page.locator(`.goal-option:has(input[value="${id}"])`).click();
        assert.equal(await page.locator('#recommended-title').textContent(), title);
        assert.equal(await page.locator('#kit-price').textContent(), id === 'complete' ? '₹899' : '₹499');
        await noOverflow(`${width}px ${id}`);
        await page.locator('#kit-details').click();
        if (id === 'scientist') {
          await page.waitForURL('**/course-bundles/data-scientist-genai-engineer-bundle');
          assert(await page.locator('#product-title').isVisible());
          await page.goto(url);
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
        await page.locator('.mobile-cta a').click();
        assert.equal(new URL(page.url()).hash, '#career-goal');
      }
      // Capture the page in its default state, with lazy assets fully loaded.
      await page.goto(url);
      await page.evaluate(async () => {
        document.querySelectorAll('img').forEach(img => img.loading = 'eager');
        await Promise.all([...document.images].map(img => img.decode()));
        await document.fonts.ready;
      });
      await page.screenshot({ path: path.join(output, `homepage-${width}.png`), fullPage: true, style: '.mobile-cta { visibility: hidden; }' });
      if (width === 390 || width === 1440) await page.screenshot({ path: path.join(output, `homepage-${width}-viewport.png`) });
      report.push({ width, overflow: false, allFourKits: 'pass', dialogs: 'pass', screenshot: `homepage-${width}.png` });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
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
    for (const id of ['choose', 'use']) {
      const trigger = page.locator(`.video-poster[data-video="${id}"]`);
      await trigger.click();
      assert(await page.locator('#video-dialog').isVisible());
      assert.equal(await page.locator('.demo-step-count').textContent(), 'STEP 1 OF 3');
      assert.equal(await page.locator('#video-player iframe').count(), 0);
      await page.locator('#demo-next').click();
      assert.equal(await page.locator('.demo-step-count').textContent(), 'STEP 2 OF 3');
      await page.locator('#demo-prev').click();
      await page.locator('#demo-play').click();
      assert.equal(await page.locator('#demo-play').textContent(), 'Pause demo');
      if (id === 'choose') {
        await page.waitForFunction(() => document.querySelector('.demo-step-count').textContent === 'STEP 2 OF 3', null, { timeout: 8000 });
      }
      await page.locator('#demo-play').click();
      assert.equal(await page.locator('#demo-play').textContent(), 'Play demo');
      await page.screenshot({ path: path.join(output, `guide-${id}-390.png`) });
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.querySelector('#video-player').childElementCount === 0);
      assert.equal(await page.locator('#video-player').innerHTML(), '');
      assert(await trigger.evaluate(el => el === document.activeElement));
    }
    await page.locator('.faq-list summary').first().click();
    assert(await page.locator('.faq-list details').first().evaluate(el => el.open));
    await page.locator('.faq-list summary').first().click();
    assert(!(await page.locator('.faq-list details').first().evaluate(el => el.open)));
    const invalidLinks = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => link.hash && !document.getElementById(link.hash.slice(1))).map(link => link.getAttribute('href')));
    assert.deepEqual(invalidLinks, []);
    const brokenImages = await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).map(img => img.src));
    assert.deepEqual(brokenImages, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    assert.deepEqual(external, []);
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({ status: 'pass', viewports: report, interactions: ['keyboard career selection', 'comparison card navigation', 'mobile menu', 'mobile CTA', 'kit dialogs and focus restoration', 'resource navigation', 'both video demos and controls', 'FAQ accordion'], consoleErrors: errors, missingAssets: missing, externalRequests: external }, null, 2));
    console.log(`PASS: ${widths.join(', ')}px. All kit states, dialogs, menus, guides, FAQs, assets and overflow checks passed.`);
  } finally { await browser.close(); }
})().catch(error => {
  fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({ status: 'failed', error: error.message }, null, 2));
  console.error(error);
  process.exitCode = 1;
});
