const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const url = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:4173/').href;
const origin = new URL(url).origin;

(async () => {
  const { careerResources, resourceEndpoint } = await import('../js/career-resources-data.js');
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [], missing = [], posts = [];
  let reply = 'success', release;
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) missing.push(response.url()); });
  // Every external request is intercepted: test details never reach Sheets/email.
  await context.route('**/*', async route => {
    if (route.request().url() === resourceEndpoint) {
      assert.equal(route.request().method(), 'POST');
      posts.push(Object.fromEntries(new URLSearchParams(route.request().postData())));
      if (reply === 'pending') await new Promise(resolve => { release = resolve; });
      if (reply === 'network') return route.abort('failed');
      return route.fulfill({ status: reply === 'http-error' ? 500 : 200,
        contentType: reply === 'html-error' ? 'text/html' : reply === 'plain' ? 'text/plain' : 'application/json',
        body: reply === 'json-error' ? '{"result":"error","error":"Could not save"}' :
          reply === 'html-error' ? '<html><title>Error</title>Script failed</html>' :
          reply === 'plain' ? 'Success' : '{"result":"success"}' });
    }
    if (new URL(route.request().url()).origin === origin) return route.continue();
    return route.abort();
  });
  async function openResources() {
    await page.goto(url);
    if (await page.locator('body.career-page').count()) return;
    if (await page.locator('.menu-toggle').isVisible()) await page.locator('.menu-toggle').click();
    await page.locator('#main-nav [data-view="resources"]').click();
    await page.locator('#career-resources-title').waitFor();
  }
  async function openForm(id) {
    await page.locator(`[data-resource="${id}"]`).click();
    await page.locator('#resource-name').fill('QA Reader');
    await page.locator('#resource-email').fill('qa@example.test');
    await page.locator('#resource-phone').fill('+91 9000000000');
  }
  async function closeForm() {
    await page.keyboard.press('Escape');
    await page.locator('#resource-dialog').waitFor({ state: 'hidden' });
  }
  try {
    fs.mkdirSync('screenshots', { recursive: true });
    for (const width of [320,390,768,900,1024,1440]) {
      await page.setViewportSize({ width, height: 900 });
      await openResources();
      assert.equal(page.url(), url);
      assert.equal(await page.locator('.resource-card').count(), 5);
      assert.equal(await page.locator('#main-nav a[href="#inside"]').count(), 0);
      assert.equal(await page.locator('#main-nav [data-view="resources"] .free-tag').textContent(), 'Free');
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => { img.loading = 'eager'; return img.decode(); })); });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (width >= 900) assert(await page.evaluate(() => document.querySelector('.site-header .brand').getBoundingClientRect().right < document.querySelector('#main-nav').getBoundingClientRect().left));
      await openForm('sql-handbook');
      assert(await page.locator('#resource-dialog').evaluate(el => el.scrollWidth <= el.clientWidth));
      assert.equal(await page.locator('.resource-delivery-note').count(), 2);
      assert.equal(await page.locator('#resource-email-delivery').evaluate(el => getComputedStyle(el).color), 'rgb(180, 35, 24)');
      if ([390,1440].includes(width)) await page.screenshot({path: `screenshots/resource-delivery-form-${width}.png`});
      await closeForm();
      assert(await page.locator('[data-resource="sql-handbook"]').evaluate(el => el === document.activeElement));
      if ([390,1440].includes(width)) await page.screenshot({ path: `screenshots/career-resources-${width}.png`, fullPage: true });
    }
    // Every migrated resource uses the original six-field contract and matching file.
    for (const resource of careerResources) {
      await openForm(resource.id);
      await page.locator('#resource-form [type="submit"]').click();
      await page.locator('#resource-success').waitFor();
      assert.deepEqual(posts.at(-1), { name:'QA Reader', email:'qa@example.test', phone:'+91 9000000000', fileLink:resource.fileLink, subject:resource.subject, emailTitle:resource.emailTitle });
      assert.equal(await page.locator('#resource-success h3').textContent(), 'Check your Email or WhatsApp.');
      assert.equal(await page.locator('#resource-success a, #resource-success button, a[href*="drive.google.com"]').count(), 0);
      if (resource.id === 'sql-handbook') await page.screenshot({path:'screenshots/resource-delivery-success.png'});
      await closeForm();
    }
    await openForm('sql-handbook');
    let count = posts.length;
    await page.locator('#resource-phone').fill('invalid');
    await page.locator('#resource-form [type="submit"]').click();
    assert.equal(posts.length, count);
    assert.equal(await page.locator('#resource-phone').evaluate(el => el.checkValidity()), false);
    await page.locator('#resource-phone').fill('+91 9000000000');
    await page.locator('#resource-name').fill('   ');
    await page.locator('#resource-form [type="submit"]').click();
    assert.equal(posts.length, count);
    await page.locator('#resource-name').fill('QA Reader');
    for (reply of ['http-error','json-error','html-error','network']) {
      await page.locator('#resource-form [type="submit"]').click();
      await page.locator('#resource-error').waitFor();
      await page.waitForFunction(() => !document.querySelector('#resource-form [type="submit"]').disabled);
      assert(await page.locator('#resource-success').isHidden());
      assert.equal(await page.locator('#resource-email').inputValue(), 'qa@example.test');
      assert.equal(await page.locator('#resource-download').count(), 0);
    }
    reply = 'plain';
    await page.locator('#resource-form [type="submit"]').click();
    await page.locator('#resource-success').waitFor();
    await closeForm();
    reply = 'pending';
    await openForm('ds-handbook');
    count = posts.length;
    await page.locator('#resource-form [type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('#resource-form [type="submit"]').disabled);
    await page.locator('#resource-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles:true, cancelable:true })));
    assert.equal(posts.length, count + 1, 'No duplicate POST while submitting');
    await closeForm();
    reply = 'success';
    release();
    await openForm('eda-part01');
    assert(await page.locator('#resource-success').isHidden());
    await page.locator('#resource-form [type="submit"]').click();
    await page.locator('#resource-success').waitFor();
    assert.equal(posts.at(-1).emailTitle, careerResources.find(item => item.id === 'eda-part01').emailTitle);
    await closeForm();
    // The new view survives refresh and Back/Forward without changing the URL.
    await page.reload();
    await page.locator('#career-resources-title').waitFor();
    await page.locator('.site-header .brand').click();
    await page.locator('#hero-title').waitFor();
    await page.goBack();
    await page.locator('#career-resources-title').waitFor();
    assert.equal(page.url(), url);
    assert.equal(await page.locator('.resource-card').count(), 5);
    assert(await page.evaluate(() => { const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);return new Set(ids).size===ids.length; }));
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    console.log('PASS: Career Resources at 6 widths; all 5 delivery requests without download buttons; validation, failures/retry, duplicate prevention, close/reopen, navigation. No live submissions.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
