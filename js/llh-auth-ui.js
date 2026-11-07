import { escapeHtml } from './llh-auth-utils.js';
import { mountDashboard } from './llh-dashboard.js';

const icons = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
};
export function mountAuth(adapter) {
  const stage = document.getElementById('auth-stage');
  const local = adapter.local === true;
  document.getElementById('environment-label').hidden = !local;
  if (location.hash || location.search) history.replaceState(null, '', location.pathname);
  let mode = 'signup', step = 'email', email = '', busy = false, recovering = false;
  let destroyDashboard = null;
  const icon = name => `<div class="step-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg></div>`;
  const primary = text => `<button class="primary" type="submit">${text}<span class="arrow" aria-hidden="true">→</span></button>`;
  const back = '<button class="stage-back" type="button" data-action="back"><span aria-hidden="true">←</span> Back</button>';
  const progress = n => `<div class="step-progress" aria-label="Step ${n} of 4">${[1,2,3,4].map(i => `<i class="${i <= n ? 'active' : ''}"></i>`).join('')}</div>`;
  const code = (label, pin = false) => `<label class="field-label" for="auth-code">${label}</label><input class="code-input" id="auth-code" type="${pin ? 'password' : 'text'}" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" minlength="4" autocomplete="${pin ? (step === 'login' ? 'current-password' : 'new-password') : 'one-time-code'}" placeholder="${pin ? '••••' : '––––'}" aria-describedby="form-error form-status" required />`;

  function render(focus = true) {
    if (step === 'welcome') {
      document.querySelector('.auth-shell').hidden = true;
      document.querySelector('.skip-link').href = '#dashboard-main';
      document.querySelector('.skip-link').textContent = 'Skip to dashboard';
      if (!destroyDashboard) destroyDashboard = mountDashboard({
        displayName: local ? 'Learner' : email.split('@')[0],
        onLogout: async () => {
          await adapter.logout();
          destroyDashboard(); destroyDashboard = null;
          mode = 'login'; step = 'email'; recovering = false;
          render();
        },
      });
      return;
    }
    document.querySelector('.auth-shell').hidden = false;
    document.querySelector('.skip-link').href = '#auth-main';
    document.querySelector('.skip-link').textContent = 'Skip to sign in';
    document.title = 'Welcome | LearnLytics Learning Hub';
    let body;
    if (step === 'email') {
      body = `<p class="step-kicker">YOUR NEXT CHAPTER</p><h2>${mode === 'signup' ? 'Begin something great.' : 'Good to see you again.'}</h2><p class="intro">${mode === 'signup' ? 'A fresh start, a little curiosity.<br />Let’s get you into your Learning Hub.' : 'Pick up where you left off.<br />Your Learning Hub is waiting for you.'}</p>
        <div class="auth-tabs" role="group" aria-label="Account options"><button type="button" data-mode="signup" aria-pressed="${mode === 'signup'}">Create account</button><button type="button" data-mode="login" aria-pressed="${mode === 'login'}">Sign in</button></div>
        <label class="field-label" for="auth-email">${local ? 'Email or demo identifier' : 'Email address'}</label><div class="input-wrap"><svg class="email-icon" viewBox="0 0 24 24" aria-hidden="true">${icons.mail}</svg><input class="email-input" id="auth-email" type="${local ? 'text' : 'email'}" autocomplete="${local ? 'off' : 'username'}" placeholder="you@example.com" value="${escapeHtml(email)}" maxlength="254" aria-describedby="form-error form-status" required /></div>
        ${primary('Continue')}<p class="footnote">${mode === 'signup' ? 'Verify your email. Set your PIN. Make it yours.' : 'Use your registered email to continue.'}</p>`;
    } else if (step === 'otp') {
      body = `${progress(2)}${icon('mail')}<h2>Check your inbox.</h2><p class="intro">${local ? 'Use the local verification code for' : 'Enter the 4-digit code sent to'}<br /><strong>${escapeHtml(email)}</strong></p>${code('Verification code')}${primary('Verify email')}<div class="resend-row"><span>Need another code?</span><button class="text-link" data-action="resend" type="button">Resend code</button></div>${back}`;
    } else if (step === 'create' || step === 'confirm') {
      const confirm = step === 'confirm';
      body = `${progress(confirm ? 4 : 3)}${icon('lock')}<h2>${confirm ? 'Make it official.' : recovering ? 'A fresh start.' : 'Your own little key.'}</h2><p class="intro">${confirm ? 'Enter your PIN once more to confirm it.<br />You’re almost there.' : 'Create a 4-digit PIN for your Learning Hub.<br />Choose something you’ll remember.'}</p>${code(confirm ? 'Confirm your PIN' : 'Create your PIN', true)}<div class="field-meta"><span>4 numbers. Just for you.</span><button class="text-link" type="button" data-action="reveal">Show PIN</button></div>${primary(confirm ? 'Confirm PIN' : 'Continue')}${back}`;
    } else if (step === 'login') {
      body = `${icon('lock')}<h2>Welcome back.</h2><p class="intro">Enter your PIN to continue as<br /><strong>${escapeHtml(email)}</strong></p>${code('Your 4-digit PIN', true)}<div class="field-meta"><button class="text-link" type="button" data-action="reveal">Show PIN</button><button class="text-link" type="button" data-action="recover">Forgot PIN?</button></div>${primary('Sign in')}${back}`;
    } else if (step === 'ready') {
      body = `<div class="success-icon" aria-hidden="true">✓</div><p class="step-kicker">YOU’RE ALL SET</p><h2>${recovering ? 'A new PIN. A fresh start.' : 'The next chapter is yours.'}</h2><p class="intro">${recovering ? 'Your PIN has been reset.' : 'Your email is verified and your PIN is ready.'}<br />Let’s take the next step.</p>${primary('Continue to LLH')}`;
    }
    stage.innerHTML = `<form id="llh-form" autocomplete="${local ? 'off' : 'on'}">${body}<p id="form-error" class="error" role="alert"></p><p id="form-status" class="status" role="status" aria-live="polite"></p></form>`;
    stage.querySelector('form').addEventListener('submit', submit);
    // Local PINs must never be offered to browser credential persistence.
    if (local) stage.querySelectorAll('input').forEach(input => input.autocomplete = 'off');
    stage.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
      if (busy) return;
      adapter.cancel(); mode = button.dataset.mode; step = 'email'; recovering = false; render();
    }));
    stage.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => action(button.dataset.action, button)));
    stage.querySelector('#auth-code')?.addEventListener('input', event => {
      event.target.value = event.target.value.replace(/[^0-9]/g, '').slice(0, 4);
      event.target.removeAttribute('aria-invalid');
      document.getElementById('form-error').textContent = '';
    });
    if (focus) (stage.querySelector('input') || stage.querySelector('.primary'))?.focus({ preventScroll: true });
  }
  async function work(task) {
    if (busy) return;
    busy = true;
    stage.querySelector('form').setAttribute('aria-busy', 'true');
    stage.querySelectorAll('button').forEach(button => { button.disabled = true; });
    document.getElementById('form-error').textContent = '';
    document.getElementById('form-status').textContent = '';
    try { await task(); }
    catch (error) {
      document.getElementById('form-error').textContent = error.message || 'Unable to continue. Please try again.';
      const input = stage.querySelector('input');
      if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
    } finally {
      busy = false;
      stage.querySelector('form').removeAttribute('aria-busy');
      stage.querySelectorAll('button').forEach(button => { button.disabled = false; });
    }
  }
  function submit(event) {
    event.preventDefault();
    work(async () => {
      if (step === 'email') {
        email = document.getElementById('auth-email').value.trim();
        step = await adapter.begin(email, mode);
      } else {
        const input = document.getElementById('auth-code');
        let value = input?.value || '';
        if (input) input.value = '';
        try {
          if (step === 'otp') { await adapter.verify(value); step = 'create'; }
          else if (step === 'create') { await adapter.preparePin(value); step = 'confirm'; }
          else if (step === 'confirm') { await adapter.confirmPin(value); step = 'ready'; }
          else if (step === 'login') { await adapter.login(value); step = 'welcome'; }
          else if (step === 'ready') { await adapter.enter(); step = 'welcome'; }
        } finally { value = ''; }
      }
      render();
    });
  }
  function action(name, button) {
    if (busy) return;
    if (name === 'reveal') {
      const input = document.getElementById('auth-code');
      input.type = input.type === 'password' ? 'text' : 'password';
      button.textContent = input.type === 'password' ? 'Show PIN' : 'Hide PIN';
      return;
    }
    if (name === 'back') {
      if (step === 'confirm') step = 'create';
      else { adapter.cancel(); step = 'email'; recovering = false; }
      render(); return;
    }
    work(async () => {
      if (name === 'resend') {
        await adapter.resend(); document.getElementById('form-status').textContent = local ? 'A fresh local verification code is ready.' : 'A new code is on its way.';
      } else if (name === 'recover') { await adapter.recover(); recovering = true; step = 'otp'; render(); }
      else if (name === 'logout') { await adapter.logout(); mode = 'login'; step = 'email'; recovering = false; render(); }
    });
  }
  render(false);
}
