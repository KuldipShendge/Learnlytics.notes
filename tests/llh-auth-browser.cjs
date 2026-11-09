const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
 const browser = await chromium.launch({executablePath:process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
 const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 let user={id:'d314ec22-4120-49cf-a6c8-b57fc81cfa02',aud:'authenticated',role:'authenticated',email:'learner@example.com',email_confirmed_at:new Date().toISOString(),user_metadata:{}}, revoked=false, sends=0;
 const session=()=>({access_token:'fixture-access',refresh_token:'fixture-refresh',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,token_type:'bearer',user});
 // Network fixtures only: no testing entry points or credentials enter shipped code.
 await page.route('https://*.supabase.co/auth/v1/**',async route=>{
   const req=route.request(), path=new URL(req.url()).pathname;const data=req.postDataJSON();let status=200,body={};
   if(path.endsWith('/otp')) sends++;
   else if(path.endsWith('/verify')) {if(data.token==='654321') body=session();else {status=403;body={code:'otp_expired',msg:'Invalid or expired OTP'};}}
   else if(path.endsWith('/user')) {if(revoked){status=401;body={msg:'Invalid JWT'};}else {if(req.method()==='PUT')user={...user,user_metadata:data.data};body=user;}}
   else if(path.endsWith('/token')) body=session();
   await route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
 });
 await page.goto((process.env.PREVIEW_URL || 'http://127.0.0.1:4211/')+'learnlytics-learning-hub?demo=1#admin');
 await page.locator('#auth-email').fill('admin');await page.getByRole('button',{name:'Send code',exact:true}).click();assert.equal(sends,0);
 await page.locator('#auth-email').fill(user.email); await page.getByRole('button',{name:'Send code',exact:true}).click();await page.locator('#auth-code').waitFor();
 assert.equal(await page.locator('#resend').isDisabled(),true);assert.equal(sends,1);
 await page.locator('#auth-code').fill('111111');await page.getByRole('button',{name:'Verify email',exact:true}).click();await page.getByRole('alert').filter({hasText:'incorrect or expired'}).waitFor();
 await page.clock.install();await page.clock.fastForward(61000);await page.locator('#resend').click();assert.equal(sends,2);
 await page.locator('#auth-code').fill('654321');await page.getByRole('button',{name:'Verify email',exact:true}).click();await page.locator('#auth-name').fill('Test Learner');await page.getByRole('button',{name:'Continue to LLH'}).click();await page.locator('#llh-dashboard').waitFor();
 await page.reload();await page.locator('#llh-dashboard').waitFor();assert.equal(await page.locator('#auth-name').count(),0);
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
 await verifyDashboard();
 await page.getByRole('button',{name:'Account options'}).click();await page.getByRole('button',{name:'Logout',exact:true}).click();await page.locator('#auth-email').waitFor();await page.reload();await page.locator('#auth-email').waitFor();assert.equal(await page.locator('#llh-dashboard').count(),0);
 await page.locator('#auth-email').fill(user.email);await page.getByRole('button',{name:'Send code',exact:true}).click();await page.locator('#auth-code').fill('654321');await page.getByRole('button',{name:'Verify email',exact:true}).click();await page.locator('#llh-dashboard').waitFor();assert.equal(await page.locator('#auth-name').count(),0);
 revoked=true;await page.reload();await page.locator('#auth-email').waitFor();assert.equal(await page.locator('#llh-dashboard').count(),0);
 assert.deepEqual(errors,[]); console.log('PASS: OTP errors/resend, first-name setup, persisted verified session, returning user skips name, logout, rejected session blocks dashboard, responsive disabled cards and sample activity.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
