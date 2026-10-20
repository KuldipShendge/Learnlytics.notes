// Dependency-injected core is tested locally. No payment or granting logic lives here.
export function createResourceHandler({ authenticate, resolve, sign, enabled, origins, storageOrigin }) {
  return async request => {
    const origin = request.headers.get('origin');
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin' };
    if (origin && origins.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Headers'] = 'authorization, apikey, content-type, x-client-info';
      headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    }
    const reply = (status, message) => new Response(JSON.stringify(message), { status, headers });
    if (origin && !origins.includes(origin)) return reply(403, { error: 'Request not allowed.' });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return reply(405, { error: 'Method not allowed.' });
    try {
      const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
      if (!token) return reply(401, { error: 'Please sign in again.' });
      const user = await authenticate(token);
      if (!user?.id || !user.email_confirmed_at) return reply(401, { error: 'Verified sign-in required.' });
      const raw = await request.text();
      if (raw.length > 2048) return reply(400, { error: 'Invalid resource request.' });
      let body;
      try { body = JSON.parse(raw); } catch { return reply(400, { error: 'Invalid resource request.' }); }
      if (typeof body?.resource_id !== 'string' || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(body.resource_id)) {
        return reply(400, { error: 'Invalid resource request.' });
      }
      // All identity, product and URL fields supplied by the caller are ignored.
      const resource = await resolve(user.id, body.resource_id);
      if (!resource) return reply(404, { error: 'Resource unavailable for this account.' });
      if (!enabled || resource.provider !== 'supabase_storage') {
        return reply(409, { error: 'Resource delivery is not enabled yet.' });
      }
      const path = resource.locator;
      if (typeof path !== 'string' || !path || path.includes('..') || path.includes(':') || path.startsWith('/') || path.includes('\\')) {
        return reply(409, { error: 'Resource unavailable.' });
      }
      const url = await sign(path, 60);
      const parsed = new URL(url);
      if (parsed.origin !== storageOrigin || !parsed.pathname.startsWith('/storage/v1/object/sign/llh-paid/')) throw new Error('Invalid signed destination');
      return reply(200, { url, expires_in: 60 });
    } catch {
      // Do not leak database errors, tokens, email addresses, locators or credentials.
      return reply(503, { error: 'Unable to open this resource. Please try again.' });
    }
  };
}
