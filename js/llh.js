import { libraryCards } from './llh-library-ui.js';
import { createClient } from '@supabase/supabase-js';
import { llhConfig } from './llh-config.js';
import { publicConfigurationValid, emailLinkAction } from './llh-auth-utils.js';

const $ = id => document.getElementById(id);
const message = text => { $('llh-message').textContent = text; };
// Fragments keep tokens out of HTTP logs; erase immediately before any asynchronous work.
let linkAction = emailLinkAction(location.hash);
const hadLink = Boolean(location.hash);
if (location.hash || location.search) history.replaceState(null, '', location.pathname);

if (!publicConfigurationValid(llhConfig)) {
  message('Learning Hub setup is pending. Please contact LearnLytics if you need access to your kit.');
} else {
  start();
}

function start() {
  const client = createClient(llhConfig.supabaseUrl, llhConfig.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: 'pkce', storageKey: 'learnlytics-llh-session' },
  });
  let mode = 'login';
  let recovery = false;
  let currentUser = null;
  let cache = null;
  let loadingUser = null;
  let generation = 0;
  let busy = false;
  let nextAttempt = 0;

  function setMode(next) {
    if (busy || (next === 'reset' && !recovery)) return;
    mode = next;
    $('llh-auth').hidden = false;
    $('llh-link').hidden = true;
    $('llh-library').hidden = true;
    $('auth-form').reset();
    const titles = { login: 'Welcome back', signup: 'Create your account', forgot: 'Reset your password', reset: 'Choose a new password' };
    $('auth-title').textContent = titles[mode];
    $('auth-description').textContent = ({ login: 'Enter your email and password to open My Library.', signup: 'Use your purchase email. We’ll send a one-time verification link.', forgot: 'We’ll email a secure recovery link if this address has an account.', reset: 'Enter a new password to finish recovering your account.' })[mode];
    $('auth-submit').textContent = ({ login: 'Sign in', signup: 'Create account', forgot: 'Send recovery link', reset: 'Save new password' })[mode];
    $('email-field').hidden = mode === 'reset';
    $('llh-email').required = mode !== 'reset';
    $('password-field').hidden = mode === 'forgot';
    $('llh-password').required = mode !== 'forgot';
    $('llh-password').minLength = mode === 'login' ? 1 : 12;
    $('llh-password').autocomplete = mode === 'login' ? 'current-password' : 'new-password';
    $('confirm-field').hidden = !['signup', 'reset'].includes(mode);
    $('llh-confirm').required = ['signup', 'reset'].includes(mode);
    $('password-hint').hidden = !['signup', 'reset'].includes(mode);
    document.querySelector('.llh-tabs').hidden = mode === 'reset';
    document.querySelector('.llh-auth-links').hidden = mode === 'reset';
    document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  }
  const controlsBusy = value => {
    busy = value;
    document.querySelectorAll('#llh-auth button,#verify-link').forEach(button => { button.disabled = value; });
    $('auth-form').setAttribute('aria-busy', String(value));
  };
  function clearAccount() {
    generation++;
    currentUser = null; cache = null; loadingUser = null;
    $('library-kits').replaceChildren();
    $('account-email').textContent = '';
    $('llh-library').hidden = true;
    if (!linkAction && !recovery) setMode('login');
  }
  function renderLibrary(kits) {
    $('library-summary').textContent = kits.some(kit => kit.accessible)
      ? 'Your authorized kits are ready below.' : 'No kits are linked to this account yet. Access appears after your purchase is verified.';
    $('library-kits').innerHTML = libraryCards(kits);
  }
  async function loadAccount(user, force = false) {
    if (linkAction || recovery) return;
    if (!user?.email_confirmed_at) { clearAccount(); if (user) message('Verify your email before opening your library.'); return; }
    if (currentUser?.id && currentUser.id !== user.id) clearAccount();
    currentUser = user;
    $('llh-auth').hidden = true; $('llh-link').hidden = true; $('llh-library').hidden = false;
    $('account-email').textContent = user.email;
    if (cache?.userId === user.id && !force) { renderLibrary(cache.kits); return; }
    if (loadingUser === user.id) return;
    loadingUser = user.id;
    const request = ++generation;
    $('refresh-library').disabled = true;
    $('library-summary').textContent = 'Loading your library…';
    try {
      const { data, error } = await client.rpc('llh_library');
      if (request !== generation) return;
      if (error || !Array.isArray(data)) throw new Error('Library unavailable');
      cache = { userId: user.id, kits: data };
      renderLibrary(data);
    } catch {
      if (request === generation) {
        cache = null; $('library-kits').replaceChildren();
        $('library-summary').textContent = 'Unable to load your library. Refresh to try again, or sign in again.';
      }
    } finally {
      if (request === generation) { loadingUser = null; $('refresh-library').disabled = false; }
    }
  }
  client.auth.onAuthStateChange((event, session) => {
    // Keep Supabase callbacks synchronous to avoid auth-client lock deadlocks.
    if (event === 'SIGNED_OUT') clearAccount();
    if (event === 'SIGNED_IN') setTimeout(() => loadAccount(session?.user), 0);
    // Token refresh never polls the library or inserts progress rows.
  });
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    message(''); setMode(button.dataset.mode);
  }));
  async function authAction(work) {
    if (busy) return;
    if (Date.now() < nextAttempt) { message('Please wait a moment before trying again.'); return; }
    controlsBusy(true);
    nextAttempt = Date.now() + 1500; // UX only. Supabase Auth enforces the actual server rate limits.
    try { await work(); }
    catch (error) {
      if (error?.status === 429) { nextAttempt = Date.now() + 60000; message('Too many attempts. Please wait a minute and try again.'); }
      else message('Unable to complete this request. Check your details and email verification, then try again.');
    } finally { controlsBusy(false); $('llh-password').value = ''; $('llh-confirm').value = ''; }
  }
  $('auth-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!$('auth-form').reportValidity()) return;
    const email = $('llh-email').value.trim();
    const password = $('llh-password').value;
    if (['signup', 'reset'].includes(mode) && password !== $('llh-confirm').value) { message('The passwords do not match.'); return; }
    authAction(async () => {
      if (mode === 'login') {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        message(''); await loadAccount(data.user);
      } else if (mode === 'signup') {
        const { error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: new URL('learnlytics-learning-hub', location.href).href } });
        if (error && error.status === 429) throw error;
        if (error && !['user_already_exists', 'email_exists'].includes(error.code)) throw error;
        message('If this address is eligible, a verification email is on its way. If you already have an account, sign in or reset your password.');
      } else if (mode === 'forgot') {
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: new URL('learnlytics-learning-hub', location.href).href });
        if (error) throw error;
        message('If this address has an account, a recovery email is on its way. Check your inbox and spam folder.');
      } else if (mode === 'reset' && recovery) {
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        const result = await client.auth.signOut({ scope: 'global' });
        if (result.error) throw result.error;
        recovery = false; controlsBusy(false); clearAccount(); setMode('login');
        message('Password updated. Sign in with your new password.');
      }
    });
  });
  $('resend-confirmation').addEventListener('click', () => {
    if (!$('llh-email').reportValidity()) return;
    authAction(async () => {
      const { error } = await client.auth.resend({ type: 'signup', email: $('llh-email').value.trim(), options: { emailRedirectTo: new URL('learnlytics-learning-hub', location.href).href } });
      if (error?.status === 429) throw error;
      message('If verification is needed, an email is on its way. Otherwise, sign in or reset your password.');
    });
  });
  $('verify-link').addEventListener('click', () => authAction(async () => {
    if (!linkAction) return;
    const action = linkAction;
    // Suppress library loading while recovery gives a session for changing the password.
    recovery = action.type === 'recovery';
    const { data, error } = await client.auth.verifyOtp(action);
    if (error) { recovery = false; linkAction = null; controlsBusy(false); setMode('forgot'); message('This email link is invalid or expired. Request a new link.'); return; }
    linkAction = null;
    controlsBusy(false);
    if (recovery) { setMode('reset'); message('Email link verified. Choose your new password.'); }
    else { message('Email verified. Welcome to LearnLytics.'); await loadAccount(data.user); }
  }));
  $('refresh-library').addEventListener('click', () => { if (currentUser) loadAccount(currentUser, true); });
  $('sign-out').addEventListener('click', async () => {
    $('sign-out').disabled = true;
    const { error } = await client.auth.signOut({ scope: 'local' });
    $('sign-out').disabled = false;
    if (error) message('Unable to sign out. Please try again.');
    else { clearAccount(); message('You have signed out.'); }
  });
  $('library-kits').addEventListener('click', async event => {
    const button = event.target.closest('[data-resource-id]');
    if (!button || button.disabled) return;
    button.disabled = true;
    const request = generation;
    try {
      const { data, error } = await client.functions.invoke('llh-resource-access', { body: { resource_id: button.dataset.resourceId } });
      if (request !== generation || !currentUser) return;
      if (error || !data?.url) throw new Error('Unavailable');
      const url = new URL(data.url);
      if (url.origin !== new URL(llhConfig.supabaseUrl).origin || !url.pathname.startsWith('/storage/v1/object/sign/llh-paid/')) throw new Error('Invalid destination');
      // Navigate only to the checked, short-lived URL. Never cache it or place it in the catalog.
      location.assign(url.href);
    } catch { if (request === generation) message('This resource is not available right now. Refresh your library or contact LearnLytics.'); }
    finally { button.disabled = false; }
  });

  function presentEmailLink() {
    recovery = false;
    clearAccount();
    controlsBusy(false);
    $('llh-auth').hidden = true;
    $('llh-link').hidden = false;
    $('link-title').textContent = linkAction.type === 'recovery' ? 'Recover your account' : 'Verify your email';
    $('link-description').textContent = 'Continue to use this single-use email link. No password or token is shown in the address bar.';
  }
  window.addEventListener('hashchange', () => {
    if (!location.hash) return;
    linkAction = emailLinkAction(location.hash);
    history.replaceState(null, '', location.pathname);
    if (linkAction) presentEmailLink();
    else message('This email link could not be used. Request a new verification or recovery email.');
  });
  if (linkAction) {
    presentEmailLink();
  } else {
    setMode('login');
    if (hadLink) message('This email link could not be used. Request a new verification or recovery email.');
    const bootGeneration = generation;
    client.auth.getUser().then(({ data }) => {
      if (generation === bootGeneration && data.user) loadAccount(data.user);
    }).catch(() => message('Unable to restore your session. Please sign in again.'));
  }
}
