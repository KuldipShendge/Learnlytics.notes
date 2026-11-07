const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');

(async () => {
  let server;
  let browser;
  try {
    let base = process.env.PREVIEW_URL;
    if (!base) {
      const root = path.resolve('dist');
      const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ttf': 'font/ttf' };
      const config = JSON.parse(await fs.readFile('vercel.json', 'utf8'));
      server = http.createServer(async (request, response) => {
        try {
          let pathname = new URL(request.url, 'http://localhost').pathname;
          const original = pathname;
          pathname = config.rewrites.find(route => route.source === pathname)?.destination || pathname;
          if (pathname === '/') pathname = '/index.html';
          const file = path.resolve(root, '.' + decodeURIComponent(pathname));
          if (!file.startsWith(root + path.sep)) throw new Error('Outside public build');
          const headers = Object.fromEntries((config.headers.find(rule => rule.source === original)?.headers || []).map(header => [header.key, header.value]));
          const content = await fs.readFile(file);
          response.writeHead(200, { ...headers, 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
          response.end(content);
        } catch { response.writeHead(404); response.end(); }
      });
      await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
      base = `http://127.0.0.1:${server.address().port}/`;
    }
    browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [], apiCalls = [], assetFailures = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (['fetch', 'xhr'].includes(request.resourceType())) apiCalls.push(request.url());
    });
    page.on('response', response => { if (response.status() >= 400) assetFailures.push(response.url()); });
    await fs.mkdir('screenshots', { recursive: true });
    for (const route of ['learnlytics-learning-hub', 'llh.html']) {
      await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
      await page.locator('#llh-library').waitFor();
      assert.equal(await page.locator('#llh-auth').isVisible(), false);
      assert.equal(await page.locator('.llh-account-actions').isVisible(), false);
      assert.equal(await page.locator('.llh-kit').count(), 3);
      assert(!/setup is pending|admin \/ admin|Demo account/.test(await page.locator('body').innerText()));
      assert.equal(await page.locator('[data-resource-id]').count(), 0);
    }
    for (const kit of ['analyst', 'scientist', 'engineer', 'complete']) {
      await page.locator('#preview-kit').selectOption(kit);
      assert.equal(await page.locator('.llh-kit:not(.is-locked)').count(), kit === 'complete' ? 3 : 1);
      assert.equal(await page.locator('.llh-preview-trackers .hub-preview-panel').count(), 2);
      for (const width of [320, 390, 900, 1440]) {
        await page.setViewportSize({ width, height: 950 });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${kit}: overflow at ${width}`);
        if (kit === 'complete' && [390, 1440].includes(width)) await page.screenshot({ path: `screenshots/llh-public-preview-${process.env.PREVIEW_URL ? 'live' : 'local'}-${width}.png`, fullPage: true });
      }
    }
    await page.locator('[data-preview-resource]').first().click();
    assert(await page.locator('dialog').isVisible());
    assert.match(await page.locator('dialog').innerText(), /Paid files are not available/);
    assert.equal(await page.locator('dialog a').count(), 0);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').isVisible(), false);
    await page.locator('#preview-kit').selectOption('analyst');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('#preview-kit').inputValue(), 'complete');
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    assert.deepEqual(apiCalls, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(assetFailures, []);
    assert(await page.locator('.brand img').evaluate(img => img.complete && img.naturalWidth > 0));
    console.log('PASS: both LLH routes, four kits, 320/390/900/1440px, tracker panels, details dialog, no login, backend requests, paid-file links, storage, asset failures or JS errors.');
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
