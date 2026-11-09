import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicConfigurationValid } from '../js/llh-auth-utils.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function publicConfig() {
  const config = { supabaseUrl: process.env.LLH_SUPABASE_URL || 'https://coyucrdmkduauotxvxob.supabase.co', publishableKey: process.env.LLH_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_nqh5pcQDHVf2ljLoNVlJbA_ZhoxZDSu' };
  if ((config.supabaseUrl || config.publishableKey) && !publicConfigurationValid(config)) {
    throw new Error('Invalid LLH public configuration. Supply a valid Supabase URL and publishable/anon key. Never use a secret key.');
  }
  return config;
}
export async function buildLLH(outdir = root) {
  const config = publicConfig();
  await build({ entryPoints: [path.join(root, 'js/llh-auth.js')], outfile: path.join(outdir, 'assets/vendor/llh-client.js'), bundle: true,
    define: { __LLH_CONFIG__: JSON.stringify(config) }, platform: 'browser', format: 'esm', target: ['es2022'], minify: true, sourcemap: false, legalComments: 'eof',
    plugins: [{ name: 'no-demo-in-production', setup(builder) {
      builder.onResolve({ filter: /(?:dev[\\/]|__local|demo-adapter|auth-demo)/ }, () => { throw new Error('Local authentication fixtures cannot enter a production bundle'); });
    } }],
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildLLH();
  console.log('Local LLH browser client built. No deployment performed.');
}
