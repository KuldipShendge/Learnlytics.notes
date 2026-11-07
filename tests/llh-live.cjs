// Read-only production verification. Never submits purchases or real auth requests.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');
const origin = process.env.LIVE_URL || 'https://www.learnlyticshandbook.shop';
(async () => {
  const results = { routes: [], exclusions: [], payments: [], screenshots: [], dashboard: 'Production assets present; access remains disabled pending real authentication.' };
  for (const path of ['/', '/learnlytics-learning-hub', '/llh.html', '/data-analyst', '/data-scientist-gen-ai', '/machine-learning-engineer', '/all-in-one-combo']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    if (['/llh.html','/learnlytics-learning-hub'].includes(path)) {
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert(response.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
    }
    results.routes.push({ path, status: response.status });
  }
  for (const path of ['/__local/llh-auth-demo.js', '/__local/llh-demo-adapter.js', '/dev/llh-demo-adapter.js', '/internal/llh/auth-client.js', '/.env', '/supabase/config.toml', '/api/create-order', '/api/razorpay-webhook', '/.llh-test/backups/llh-before-auth-rebuild-fd3badf.zip', '/pdfs/sql-questions.pdf']) {
    const response = await fetch(origin + path); assert.equal(response.status, 404, path);
    results.exclusions.push({ path, status: response.status });
  }
  const response = await fetch(origin + '/assets/vendor/llh-client.js');
  assert.equal(response.status, 200);
  const bundle = await response.text();
  assert(bundle.includes('Welcome back,') && bundle.includes('7-Day Interview Readiness'));
  assert(!/\badmin\b|0000|DEMO_OTP|createDemoAdapter|PBKDF2|sb_secret_|__local/.test(bundle));
  // The canonical domain must serve this exact locally tested release artifact.
  assert.equal(bundle, await fs.readFile('dist/assets/vendor/llh-client.js','utf8'));
  for (const path of ['/css/llh-dashboard.css', '/js/llh-dashboard.js', '/js/llh-dashboard-data.js']) {
    const asset = await fetch(origin + path);
    assert.equal(asset.status, 200, path);
    const deployed = (await asset.text()).replace(/\r\n/g, '\n');
    const tested = (await fs.readFile('dist' + path, 'utf8')).replace(/\r\n/g, '\n');
    assert.equal(deployed, tested, 'Deployed dashboard asset must match the tested release: ' + path);
  }
  for (const id of ['S2y4eZ3','fain7HM','6j2zp8fF','qLYK5iB']) {
    const response = await fetch('https://rzp.io/rzp/' + id);
    assert.equal(response.status,200,id);
    assert(new URL(response.url).hostname.endsWith('razorpay.com'));
    results.payments.push({ id, status: response.status, destination: response.url });
  }
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try {
    const context=await browser.newContext({reducedMotion:'reduce'});
    const page=await context.newPage(); const errors=[],authRequests=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>{if(['fetch','xhr'].includes(request.resourceType()))authRequests.push(request.url());});
    for (const width of [390,768,1440]) {
      await page.setViewportSize({width,height:width===390?844:960});
      await page.goto(origin+'/learnlytics-learning-hub?demo=1#admin');
      await page.locator('#auth-email').waitFor();
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('#environment-label').isVisible(),false);
      assert.equal(await page.locator('#auth-email').getAttribute('type'),'email');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      const screenshot=`screenshots/llh-live-login-${width}.png`;
      await page.screenshot({path:screenshot,fullPage:true}); results.screenshots.push(screenshot);
      await page.locator('#auth-email').fill('admin');
      await page.getByRole('button',{name:'Continue',exact:true}).click();
      assert.equal(await page.locator('#auth-code,#llh-dashboard').count(),0);
      await page.locator('#auth-email').fill('check@example.com');
      await page.getByRole('button',{name:'Continue',exact:true}).click();
      await page.getByRole('alert').filter({hasText:'Sign-in is not available yet'}).waitFor();
      assert.equal(await page.locator('#auth-code,#llh-dashboard').count(),0);
    }
    assert.deepEqual(errors,[]); assert.deepEqual(authRequests,[]);
    await page.goto(origin+'/llh.html');await page.locator('#auth-email').waitFor();
    results.javascriptErrors=errors; results.authRequests=authRequests;
    await fs.writeFile('screenshots/llh-task02-live-verification.json',JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
