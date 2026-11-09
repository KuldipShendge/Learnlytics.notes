import { createClient } from '@supabase/supabase-js';
import { mountAuth } from './llh-auth-ui.js';

const client = createClient(__LLH_CONFIG__.supabaseUrl, __LLH_CONFIG__.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'llh-auth-session' },
});
mountAuth(client.auth);
