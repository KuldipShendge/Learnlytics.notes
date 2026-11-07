const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4210/';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  let productionServer;
  try {
    await fs.mkdir('screenshots', { recursive: true });
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 960 } });
    const page = await context.newPage();
    const errors = [], backend = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if (['xhr','fetch'].includes(r.resourceType())) backend.push(r.url()); });
    page.on('response', r => { if (r.status() >= 400) failures.push(r.url()); });
    const title = text => page.getByRole('heading', { name: text, exact: true }).waitFor();
    const logout = async () => {
      await page.getByRole('button', { name: 'Account options' }).click();
      await page.getByRole('button', { name: 'Logout', exact: true }).click();
      await page.locator('#llh-dashboard').waitFor({ state: 'detached' });
    };
    const code = async (value, button) => {
      await page.locator('#auth-code').fill(value);
      await page.getByRole('button', { name: button, exact: true }).click();
      await page.locator('form[aria-busy="true"]').waitFor({ state: 'detached' });
    };
    const screenshot = async name => {
      for (const width of [390,1440]) {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });
        await page.screenshot({ path: `screenshots/llh-auth-${name}-${width}.png`, fullPage: true });
      }
    };
    const verifyDashboard = async () => {
      const initialUrl = page.url();
      const accountToggle = page.getByRole('button', { name: 'Account options' });
      const accountPanel = page.locator('#dash-account-panel');
      const overviewLink = page.getByRole('link', { name: 'Overview', exact: true });
      const toolsLink = page.getByRole('link', { name: 'Learning tools', exact: true });
      const settleScroll = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const assertNavigation = async current => {
        await settleScroll();
        assert.equal(await overviewLink.getAttribute('aria-current'), current === 'Overview' ? 'location' : null);
        assert.equal(await toolsLink.getAttribute('aria-current'), current === 'Learning tools' ? 'location' : null);
        assert.equal(await page.locator('.dash-breadcrumb strong').innerText(), current);
      };
      for (const width of [320,390,768,900,1440]) {
        await page.setViewportSize({ width, height: width < 500 ? 844 : 960 });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Dashboard overflow at ' + width);
        assert.equal(await page.locator('.dash-feature').count(), 4);
        for (const card of await page.locator('.dash-feature').all()) {
          await card.click();
          assert.equal(page.url(), initialUrl, 'Unavailable feature must not navigate');
        }
        if (width < 500) {
          await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
          await settleScroll();
          await assertNavigation('Learning tools');
          const accountPosition = await accountToggle.evaluate(button => {
            const box = button.getBoundingClientRect();
            return {
              scrollY, top: box.top, bottom: box.bottom, left: box.left, right: box.right,
              height: box.height, viewportHeight: innerHeight, viewportWidth: innerWidth,
              reachable: button.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)),
            };
          });
          assert(accountPosition.scrollY > 0, 'Mobile account check must run after scrolling');
          assert(accountPosition.top >= 0 && accountPosition.bottom <= accountPosition.viewportHeight, 'Mobile account must stay in the viewport');
          assert(accountPosition.left >= 0 && accountPosition.right <= accountPosition.viewportWidth, 'Mobile account must not overflow horizontally');
          assert(accountPosition.height >= 44 && accountPosition.reachable, 'Mobile account must remain a reachable touch target');
          await accountToggle.click();
          assert.equal(await accountPanel.isVisible(), true);
          assert.equal(await page.getByRole('button', { name: 'Logout', exact: true }).isVisible(), true);
          assert.equal(await page.evaluate(() => scrollY), accountPosition.scrollY, 'Opening account must not jump to the top');
          await page.keyboard.press('Escape');
        }
        await page.evaluate(() => scrollTo(0, 0));
        await assertNavigation('Overview');
        await page.locator('#dashboard-main').evaluate(main => main.focus({ preventScroll: true }));
        await page.screenshot({ path: 'screenshots/llh-dashboard-' + width + '.png', fullPage: true });
      }

      const activityDetail = page.locator('#dash-activity-detail');
      const activityReset = page.getByRole('button', { name: 'Show weekly activity total' });
      const friday = page.getByRole('button', { name: 'Friday: 40 sample minutes', exact: true });
      const wednesday = page.getByRole('button', { name: 'Wednesday: 0 sample minutes', exact: true });
      assert.equal(await activityDetail.innerText(), '120 sample minutes this week');
      assert.equal(await activityReset.isVisible(), false);
      assert.equal(await page.locator('.dash-day[aria-pressed="true"]').count(), 0);
      await friday.click();
      assert.equal(await activityDetail.innerText(), 'Friday · 40 sample minutes');
      assert.equal(await friday.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.dash-day[aria-pressed="true"]').count(), 1);
      assert.equal(await activityReset.isVisible(), true);
      await wednesday.focus();
      await page.keyboard.press('Space');
      assert.equal(await activityDetail.innerText(), 'Wednesday · 0 sample minutes · Rest day');
      assert.equal(await wednesday.getAttribute('aria-pressed'), 'true');
      assert.equal(await friday.getAttribute('aria-pressed'), 'false');
      assert.equal(await page.locator('.dash-day[aria-pressed="true"]').count(), 1);
      await activityReset.click();
      assert.equal(await activityDetail.innerText(), '120 sample minutes this week');
      assert.equal(await activityReset.isVisible(), false);
      assert.equal(await page.locator('.dash-day[aria-pressed="false"]').count(), 7);
      assert.equal(await wednesday.evaluate(button => button === document.activeElement), true, 'Reset must return focus to the selected day');
      assert.equal(page.url(), initialUrl, 'Exploring sample activity must not navigate');

      await accountToggle.click();
      await page.keyboard.press('Escape');
      assert.equal(await accountPanel.isVisible(), false);
      assert.equal(await accountToggle.getAttribute('aria-expanded'), 'false');
      assert.equal(await accountToggle.evaluate(button => button === document.activeElement), true);
      await accountToggle.click();
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.locator('.dash-account-website').evaluate(link => link === document.activeElement), true);
      assert.equal(await accountPanel.isVisible(), true, 'Moving focus within account must keep it open');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      assert.equal(await accountPanel.isVisible(), false, 'Tabbing outside account must dismiss the panel');
      assert.equal(await accountToggle.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('.dash-account').evaluate(account => account.contains(document.activeElement)), false);

      await toolsLink.click();
      assert.equal(await page.evaluate(() => document.activeElement.id), 'dashboard-tools');
      await assertNavigation('Learning tools');
      assert.equal(page.url(), initialUrl);
      await overviewLink.click();
      assert.equal(await page.evaluate(() => document.activeElement.id), 'dashboard-main');
      await assertNavigation('Overview');
      assert.equal(await page.locator('#llh-dashboard').count(), 1);
    };
    await page.goto(new URL('learnlytics-learning-hub', base).href);
    await title('Begin something great.');
    await page.evaluate(() => document.fonts.ready);
    await screenshot('registration');
    for (const width of [320,390,768,900,1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`);
    }
    await page.locator('#auth-email').fill('admin');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await title('Check your inbox.');
    await screenshot('otp');
    await code('1111', 'Verify email');
    await page.getByRole('alert').filter({ hasText: 'doesn’t match' }).waitFor();
    assert.equal(await page.locator('#auth-code').inputValue(), '');
    await page.getByRole('button', { name: 'Resend code' }).click();
    await page.getByRole('alert').filter({ hasText: 'wait 30 seconds' }).waitFor();
    await code('0000', 'Verify email');
    await title('Your own little key.');
    await screenshot('pin-setup');
    await page.locator('#auth-code').fill('12a3');
    assert.equal(await page.locator('#auth-code').inputValue(), '123');
    await code('2468', 'Continue');
    await title('Make it official.');
    await screenshot('pin-confirm');
    await code('2469', 'Confirm PIN');
    await page.getByRole('alert').filter({ hasText: 'don’t match' }).waitFor();
    assert.equal(await page.locator('#auth-code').inputValue(), '');
    await code('2468', 'Confirm PIN');
    await title('The next chapter is yours.');
    await screenshot('ready');
    await page.getByRole('button', { name: 'Continue to LLH' }).click();
    await title('Welcome back, Learner.');
    assert.equal(await page.locator('.dash-feature').count(), 4);
    assert.match(await page.locator('.dash-preview-note').innerText(), /Sample data.*illustrative/s);
    assert.equal(await page.locator('.dash-feature a').count(), 0);
    assert.equal(await page.locator('.dash-feature button:disabled').count(), 4);
    assert.equal(await page.locator('.llh-kit,.hub-preview-panel,canvas').count(), 0);
    await verifyDashboard();
    await logout();
    await title('Good to see you again.');
    await screenshot('sign-in');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await title('Welcome back.');
    await screenshot('returning-pin');
    await code('2469', 'Sign in');
    await page.getByRole('alert').filter({ hasText: 'doesn’t match' }).waitFor();
    await code('2468', 'Sign in');
    await title('Welcome back, Learner.');
    await logout();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Forgot PIN?' }).click();
    await title('Check your inbox.');
    await code('0000', 'Verify email');
    await title('A fresh start.');
    await screenshot('recovery');
    await code('1357', 'Continue');
    await code('1357', 'Confirm PIN');
    await title('A new PIN. A fresh start.');
    await page.getByRole('button', { name: 'Continue to LLH' }).click();
    await logout();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await code('2468', 'Sign in');
    await page.getByRole('alert').filter({ hasText: 'doesn’t match' }).waitFor();
    await code('1357', 'Sign in');
    await title('Welcome back, Learner.');
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    assert.deepEqual(await context.cookies(), []);
    assert.equal(await page.evaluate(async () => (await indexedDB.databases()).length), 0);
    await page.reload();
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.locator('#auth-email').fill('admin');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Create your PIN in this tab first' }).waitFor();
    assert.deepEqual(backend, []); assert.deepEqual(errors, []); assert.deepEqual(failures, []);
    await context.close();

    // Serve the actual public build, not the repository or local demo server.
    const root = path.resolve('dist');
    productionServer = http.createServer(async (req, res) => {
      try {
        let pathname = new URL(req.url, 'http://localhost').pathname;
        if (['/', '/learnlytics-learning-hub'].includes(pathname)) pathname = '/llh.html';
        const file = path.resolve(root, '.' + decodeURIComponent(pathname));
        if (!file.startsWith(root + path.sep)) throw new Error('Forbidden');
        const body = await fs.readFile(file);
        const type = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.ttf':'font/ttf', '.webp':'image/webp' }[path.extname(file)];
        res.writeHead(200, { 'Content-Type': type || 'application/octet-stream' }); res.end(body);
      } catch { res.writeHead(404); res.end(); }
    });
    await new Promise(resolve => productionServer.listen(0, '127.0.0.1', resolve));
    const production = await browser.newContext();
    const publicPage = await production.newPage();
    const publicOrigin = `http://127.0.0.1:${productionServer.address().port}`;
    for (const route of ['/learnlytics-learning-hub?demo=1#admin', '/llh.html']) {
      await publicPage.goto(publicOrigin + route);
      await publicPage.locator('#auth-email').waitFor();
      assert.equal(await publicPage.locator('#environment-label').isVisible(), false);
      assert.equal(await publicPage.locator('#auth-email').getAttribute('type'), 'email');
      assert(!publicPage.url().includes('?') && !publicPage.url().includes('#'));
      await publicPage.locator('#auth-email').fill('test@example.com');
      await publicPage.getByRole('button', { name: 'Continue', exact: true }).click();
      await publicPage.getByRole('alert').filter({ hasText: 'Sign-in is not available yet' }).waitFor();
      assert.equal(await publicPage.locator('#auth-code,#llh-dashboard').count(), 0);
    }
    for (const endpoint of ['/__local/llh-auth-demo.js','/__local/llh-demo-adapter.js','/dev/llh-demo-adapter.js','/internal/llh/auth-client.js']) {
      assert.equal((await fetch(publicOrigin + endpoint)).status, 404);
    }
    await production.close();
    console.log('PASS: registration, OTP errors, PIN mismatch, returning login, verified recovery, old PIN rejection, logout, reload reset, zero persistent storage/API calls; dashboard activity selection/reset, navigation state, keyboard account dismissal and mobile account access; production cannot authenticate and excludes local/legacy modules.');
  } finally {
    await browser.close();
    if (productionServer) await new Promise(resolve => productionServer.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
