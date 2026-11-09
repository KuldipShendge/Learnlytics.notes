import { escapeHtml } from './llh-auth-utils.js';
import { mountDashboard } from './llh-dashboard.js';

export function mountAuth(auth) {
  const stage = document.getElementById('auth-stage');
  const shell = document.querySelector('.auth-shell');
  const skip = document.querySelector('.skip-link');
  document.getElementById('environment-label').hidden = true;
  if (location.search || location.hash) history.replaceState(null, '', location.pathname);
  let step = 'loading', email = '', busy = false, user = null, destroyDashboard = null;
  let resendAt = 0, validation = 0;
  const primary = label => `<button class="primary" type="submit">${label}<span class="arrow" aria-hidden="true">→</span></button>`;
  function removeDashboard() { destroyDashboard?.(); destroyDashboard = null; }
  function render() {
    if (step === 'dashboard') {
      shell.hidden = true; skip.href = '#dashboard-main'; skip.textContent = 'Skip to dashboard';
      if (!destroyDashboard) destroyDashboard = mountDashboard({ displayName: user.user_metadata.full_name, onLogout: async () => {
        const { error } = await auth.signOut({ scope: 'local' });
        if (error) throw error;
        user = null; removeDashboard(); step = 'email'; render();
      }});
      return;
    }
    removeDashboard(); shell.hidden = false; skip.href = '#auth-main'; skip.textContent = 'Skip to sign in';
    document.title = 'Welcome | LearnLytics Learning Hub';
    let body;
    if (step === 'loading') body = '<h2>Welcome back.</h2><p class="intro">Checking your session…</p>';
    if (step === 'email') body = `<p class="step-kicker">YOUR NEXT CHAPTER</p><h2>Good to see you again.</h2><p class="intro">Your Learning Hub is waiting for you.<br />Sign in or get started with your email.</p><label class="field-label" for="auth-email">Email address</label><input class="email-input" id="auth-email" type="email" autocomplete="email" maxlength="254" value="${escapeHtml(email)}" placeholder="you@example.com" required />${primary('Send code')}<p class="footnote">We’ll email you a 6-digit verification code.</p>`;
    if (step === 'otp') body = `<h2>Check your inbox.</h2><p class="intro">Enter the 6-digit code sent to<br /><strong>${escapeHtml(email)}</strong></p><label class="field-label" for="auth-code">Verification code</label><input class="code-input" id="auth-code" type="text" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="one-time-code" placeholder="––––––" required />${primary('Verify email')}<div class="resend-row"><span>Need another code?</span><button class="text-link" id="resend" type="button">Resend code</button></div><button class="stage-back" id="back" type="button">← Change email</button>`;
    if (step === 'name') body = `<h2>Make it yours.</h2><p class="intro">What should we call you?<br />You only need to do this once.</p><label class="field-label" for="auth-name">Your name</label><input class="email-input" id="auth-name" autocomplete="name" maxlength="80" required />${primary('Continue to LLH')}<button class="stage-back" id="leave" type="button">Sign out</button>`;
    if (step === 'retry') body = `<h2>Let’s try again.</h2><p class="intro">We couldn’t verify your session. Check your connection and try again.</p>${primary('Retry')}`;
    stage.innerHTML = `<form aria-busy="false">${body}<p id="form-error" class="error" role="alert"></p><p id="form-status" class="status" role="status" aria-live="polite"></p></form>`;
    stage.querySelectorAll('input').forEach(input => input.setAttribute('aria-describedby', 'form-error form-status'));
    stage.querySelector('form').onsubmit = event => { event.preventDefault(); work(submit); };
    stage.querySelector('#back')?.addEventListener('click', () => { if (!busy) { step = 'email'; render(); } });
    stage.querySelector('#resend')?.addEventListener('click', () => work(async () => { await send(); message('A new code is on its way.'); }));
    stage.querySelector('#leave')?.addEventListener('click', () => work(async () => { const { error } = await auth.signOut({ scope: 'local' }); if (error) throw error; step = 'email'; render(); }));
    stage.querySelector('#auth-code')?.addEventListener('input', event => { event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6); });
    stage.querySelector('input')?.focus({ preventScroll: true });
    cooldown();
  }
  function message(text) { const el = stage.querySelector('#form-status'); if (el) el.textContent = text; }
  function cooldown() {
    const button = stage.querySelector('#resend'); if (!button) return;
    const seconds = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
    button.disabled = busy || seconds > 0;
    button.textContent = seconds ? `Resend in ${seconds}s` : 'Resend code';
  }
  setInterval(cooldown, 1000);
  function errorText(error) {
    if (error.code === 'otp_expired' || error.status === 403) return 'That code is incorrect or expired. Try again or request a new code.';
    if (error.status === 429 || /rate_limit/.test(error.code || '')) return 'Too many requests. Please wait before trying again.';
    return error.message || 'Unable to connect. Please try again.';
  }
  async function work(task) {
    if (busy) return; busy = true;
    stage.querySelector('form')?.setAttribute('aria-busy', 'true');
    stage.querySelectorAll('button').forEach(button => button.disabled = true);
    stage.querySelector('#form-error').textContent = ''; message('Please wait…');
    try { await task(); }
    catch (error) { message(''); const el = stage.querySelector('#form-error'); if (el) el.textContent = errorText(error); }
    finally { busy = false; stage.querySelector('form')?.setAttribute('aria-busy', 'false'); stage.querySelectorAll('button').forEach(button => button.disabled = false); cooldown(); }
  }
  async function send() {
    if (Date.now() < resendAt) throw new Error('Please wait before requesting another code.');
    const { error } = await auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) { if (error.status === 429) resendAt = Date.now() + 60000; throw error; }
    resendAt = Date.now() + 60000;
  }
  async function submit() {
    if (step === 'email') { email = stage.querySelector('#auth-email').value.trim().toLowerCase(); await send(); step = 'otp'; render(); }
    else if (step === 'otp') {
      const token = stage.querySelector('#auth-code').value; stage.querySelector('#auth-code').value = '';
      const { error } = await auth.verifyOtp({ email, token, type: 'email' }); if (error) throw error;
      await validate();
    } else if (step === 'name') {
      const name = stage.querySelector('#auth-name').value.trim();
      if (!name || name.length > 80) throw new Error('Enter your name (up to 80 characters).');
      const { error } = await auth.updateUser({ data: { full_name: name } }); if (error) throw error;
      await validate();
    } else if (step === 'retry') await validate();
  }
  async function validate() {
    const request = ++validation;
    const { data: sessionData, error: sessionError } = await auth.getSession();
    if (request !== validation) return;
    if (sessionError) { step = 'retry'; render(); return; }
    if (!sessionData.session) { user = null; step = 'email'; render(); return; }
    // A persisted browser object alone cannot authorize the dashboard.
    const { data, error } = await auth.getUser();
    if (request !== validation) return;
    if (error || !data.user?.email_confirmed_at) {
      user = null;
      if (error?.status === 401 || error?.status === 403) { await auth.signOut({ scope: 'local' }); step = 'email'; }
      else step = 'retry';
      render(); return;
    }
    user = data.user; email = user.email || '';
    const name = user.user_metadata?.full_name;
    step = typeof name === 'string' && name.trim() ? 'dashboard' : 'name'; render();
  }
  auth.onAuthStateChange((event, session) => {
    if (!session) { if (event === 'SIGNED_OUT') { ++validation; user = null; step = 'email'; render(); } }
    // Never await another auth call inside Supabase's locked callback.
    else if (!busy) setTimeout(() => validate().catch(() => { step = 'retry'; render(); }), 0);
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !busy && user) validate().catch(() => { step = 'retry'; render(); }); });
  render(); validate().catch(() => { step = 'retry'; render(); });
}
