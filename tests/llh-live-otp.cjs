// Opt-in real OTP acceptance test. Never intercepts or mocks authentication.
// LLH_TEST_EMAIL is required; OTP is read from terminal memory, never a file.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const origin = process.env.LIVE_URL || 'https://www.learnlyticshandbook.shop';
async function readCode() {
 if (!process.stdin.isTTY) throw new Error('Run this test in an interactive terminal (TTY).');
 process.stdin.setRawMode(true); process.stdin.resume();
 return new Promise((resolve,reject)=>{
  let value='';
  const finish=(error)=>{process.stdin.off('data',input);process.stdin.setRawMode(false);process.stdin.pause();error?reject(error):resolve(value);};
  const input=chunk=>{for(const c of chunk.toString()){if(c==='\u0003')return finish(new Error('Cancelled'));if(c==='\r'||c==='\n')return finish();if(c==='\u007f')value=value.slice(0,-1);else if(/\d/.test(c)&&value.length<6)value+=c;}};
  process.stdin.on('data',input);
 });
}
(async()=>{
 assert(process.env.LLH_TEST_EMAIL,'Set LLH_TEST_EMAIL to the authorized test mailbox');
 const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  const context=await browser.newContext({reducedMotion:'reduce'}), page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/learnlytics-learning-hub');
  await page.locator('#auth-email').fill(process.env.LLH_TEST_EMAIL);
  await page.getByRole('button',{name:'Send code',exact:true}).click();
  await page.locator('#auth-code').waitFor({timeout:30000});
  console.log('LIVE_OTP_SENT: waiting for the latest 6-digit email code.');
  let code=await readCode();
  await page.locator('#auth-code').fill(code);code='';
  await page.getByRole('button',{name:'Verify email',exact:true}).click();
  await page.locator('#llh-dashboard').waitFor({timeout:30000});
  assert.equal(await page.locator('#auth-name').count(),0,'Returning user should skip name setup');
  await page.reload();await page.locator('#llh-dashboard').waitFor();
  const other=await context.newPage();await other.goto(origin+'/learnlytics-learning-hub');await other.locator('#llh-dashboard').waitFor();
  await fs.mkdir('screenshots',{recursive:true});
  for(const width of [390,768,1440]) {await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('.dash-feature button:disabled').count(),4);await page.screenshot({path:`screenshots/llh-live-authenticated-${width}.png`,fullPage:true});}
  await page.getByRole('button',{name:'Account options'}).click();await page.getByRole('button',{name:'Logout',exact:true}).click();await page.locator('#auth-email').waitFor();await other.locator('#auth-email').waitFor();
  await page.reload();await page.locator('#auth-email').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('llh-auth-session')),null);assert.deepEqual(errors,[]);
  const report={origin,realOtp:true,returningNameSkipped:true,reloadRestored:true,secondTabRestored:true,logout:true,crossTabLogout:true,reloadAfterLogoutDenied:true,widths:[390,768,1440],javascriptErrors:errors};
  await fs.writeFile('screenshots/llh-live-otp-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
