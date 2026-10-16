const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const origin = new URL(url).origin;

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', route => new URL(route.request().url()).origin === origin
    ? route.continue() : route.abort());
  const page = await context.newPage();
  const checks = [];
  async function snapshot() {
    return page.evaluate(() => [...document.body.querySelectorAll('*')].map(el => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        tag: el.tagName, id: el.id,
        box: [rect.x, rect.y, rect.width, rect.height],
        font: [style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight],
        colours: [style.color, style.backgroundColor, style.backgroundImage,
          style.borderColor, style.boxShadow, style.filter],
      };
    }));
  }
  try {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const view of ['home', 'scientist', 'analyst', 'about']) {
        await page.goto(url);
        if (!await page.locator('body.home-page').count()) {
          await page.locator('[data-view="home"]').first().click();
        }
        if (view === 'scientist') await page.locator('#kit-details').click();
        if (view === 'analyst') {
          await page.locator('.goal-option:has(input[value="analyst"])').click();
          await page.locator('#kit-details').click();
        }
        if (view === 'about') {
          if (width < 768) await page.locator('.menu-toggle').click();
          await page.locator('[data-view="about"]').first().click();
        }
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].filter(img => img.loading !== 'lazy')
            .map(img => img.decode().catch(() => {})));
          document.documentElement.dataset.theme = 'blue';
        });
        await page.screenshot({ path: `screenshots/colour-blue-${view}-${width}.png`, fullPage: true });
        const blue = await snapshot();
        await page.evaluate(() => { document.documentElement.dataset.theme = 'plum'; });
        const restored = await snapshot();
        assert.deepEqual(blue.map(({ colours, ...layout }) => layout),
          restored.map(({ colours, ...layout }) => layout), `${view} ${width}: layout changed`);
        assert.notDeepEqual(blue.map(el => el.colours), restored.map(el => el.colours));
        await page.evaluate(() => { document.querySelector('link[href*="theme-blue.css"]').disabled = true; });
        assert.deepEqual(await snapshot(), restored, `${view} ${width}: original palette was not fully restored`);
        await page.evaluate(() => {
          document.querySelector('link[href*="theme-blue.css"]').disabled = false;
          document.documentElement.dataset.theme = 'blue';
        });
        await page.waitForFunction(() => getComputedStyle(document.documentElement)
          .getPropertyValue('--accent').trim() === '#0758e8');
        assert.deepEqual(await snapshot(), blue, `${view} ${width}: reapplying blue changed the page`);
        checks.push(`${view} ${width}px: same layout; original colours restored exactly`);
      }
    }
    console.log(checks.join('\n'));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
