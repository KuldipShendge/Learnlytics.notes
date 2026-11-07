// Loopback-only UI fixture. Never import this entry point into a public build.
import { mountAuth } from '../js/llh-auth-ui.js';
import { createDemoAdapter } from './llh-demo-adapter.js';
if (!['localhost', '127.0.0.1'].includes(location.hostname)) throw new Error('Local preview only');
const adapter = createDemoAdapter();
mountAuth(adapter);
window.addEventListener('pagehide', () => adapter.destroy());
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
