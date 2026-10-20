export function publicConfigurationValid(config) {
  try {
    const url = new URL(config.supabaseUrl);
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/') return false;
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(url.hostname))) return false;
    if (config.publishableKey.startsWith('sb_publishable_')) return true;
    const payload = JSON.parse(atob(config.publishableKey.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.role === 'anon';
  } catch { return false; }
}
export function emailLinkAction(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const type = params.get('type');
  const token_hash = params.get('token_hash');
  if (!['signup', 'recovery'].includes(type) || !token_hash || !/^[a-zA-Z0-9_-]{20,256}$/.test(token_hash)) return null;
  return { type, token_hash };
}
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
