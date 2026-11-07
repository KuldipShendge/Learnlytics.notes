import { mountAuth } from './llh-auth-ui.js';

// Frontend only. A reviewed server-side design must precede real PIN verification.
const unavailable = async () => { throw new Error('Sign-in is not available yet. Please check back soon.'); };
mountAuth(Object.freeze({
  local: false,
  begin: unavailable, verify: unavailable, preparePin: unavailable,
  confirmPin: unavailable, login: unavailable, recover: unavailable,
  resend: unavailable, enter: unavailable, logout: unavailable, cancel() {},
}));
