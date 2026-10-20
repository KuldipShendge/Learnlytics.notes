import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
import { createResourceHandler } from './handler.js';

const url = Deno.env.get('SUPABASE_URL')!;
// Injected by Supabase. These values are never included in frontend output.
const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const handler = createResourceHandler({
  enabled: Deno.env.get('LLH_DELIVERY_ENABLED') === 'true',
  origins: (Deno.env.get('LLH_ALLOWED_ORIGINS') || '').split(',').map(s => s.trim()).filter(Boolean),
  storageOrigin: new URL(url).origin,
  authenticate: async (token: string) => {
    const { data, error } = await admin.auth.getUser(token);
    return error ? null : data.user;
  },
  resolve: async (userId: string, resourceId: string) => {
    const { data, error } = await admin.rpc('llh_resource_location', { p_user: userId, p_resource: resourceId });
    if (error) throw error;
    return data;
  },
  sign: async (path: string, seconds: number) => {
    const { data, error } = await admin.storage.from('llh-paid').createSignedUrl(path, seconds, { download: true });
    if (error) throw error;
    return data.signedUrl;
  },
});
Deno.serve(handler);
