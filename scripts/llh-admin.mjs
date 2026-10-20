// Operator CLI only. Never import this into browser code or deploy it as a public endpoint.
const [action, ...args] = process.argv.slice(2);
const url = process.env.LLH_ADMIN_SUPABASE_URL;
const key = process.env.LLH_ADMIN_SECRET_KEY;
if (!url || !key || !['grant', 'revoke'].includes(action)) {
  console.error('Set LLH_ADMIN_SUPABASE_URL and LLH_ADMIN_SECRET_KEY in your local shell.\nUsage: node scripts/llh-admin.mjs grant email product reference\n       node scripts/llh-admin.mjs revoke reference');
  process.exit(1);
}
const parsed = new URL(url);
if (parsed.protocol !== 'https:' && !['127.0.0.1', 'localhost'].includes(parsed.hostname)) throw new Error('HTTPS required');
let body;
if (action === 'grant') {
  const [email, product, reference] = args;
  if (!email || !['analyst', 'scientist', 'engineer', 'complete'].includes(product) || !reference || args.length !== 3) throw new Error('Invalid grant arguments');
  body = { p_email: email, p_product: product, p_reference: reference };
} else {
  if (args.length !== 1 || !args[0]) throw new Error('A reference is required');
  body = { p_reference: args[0] };
}
const headers = { apikey: key, 'Content-Type': 'application/json' };
// New Supabase secret keys use apikey; legacy service_role JWTs also use Authorization.
if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/llh_admin_${action}_test`, {
  method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(15000),
});
if (!response.ok) { console.error(`Admin request failed (${response.status}). Check the staging flag, role and arguments in Supabase. No secrets logged.`); process.exitCode = 1; }
else console.log(`${action} completed. Test access still requires a verified account. No payment was created.`);
