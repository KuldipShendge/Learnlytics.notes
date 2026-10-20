import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicConfigurationValid } from '../js/llh-auth-utils.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function publicConfig() {
  const config = { supabaseUrl: process.env.LLH_SUPABASE_URL || '', publishableKey: process.env.LLH_SUPABASE_PUBLISHABLE_KEY || '' };
  if ((config.supabaseUrl || config.publishableKey) && !publicConfigurationValid(config)) {
    throw new Error('Invalid LLH public configuration. Supply a valid Supabase URL and publishable/anon key. Never use a secret key.');
  }
  return config;
}
export async function buildLLH(outdir = root) {
  const config = publicConfig();
  await build({ entryPoints: [path.join(root, 'js/llh.js')], outfile: path.join(outdir, 'assets/vendor/llh-client.js'), bundle: true,
    platform: 'browser', format: 'esm', target: ['es2022'], minify: true, sourcemap: false, legalComments: 'eof',
    plugins: [{ name: 'public-config-only', setup(builder) {
      builder.onLoad({ filter: /[\\/]llh-config\.js$/ }, () => ({ contents: `export const llhConfig = Object.freeze(${JSON.stringify(config)});`, loader: 'js' }));
    } }],
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildLLH();
  console.log('Local LLH browser client built. No deployment performed.');
}
