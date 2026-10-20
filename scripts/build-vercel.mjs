import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { buildPublic } from './build-public.mjs';

// An old root /api directory could be automatically deployed as Vercel Functions.
// Fail closed when the new site is accidentally overlaid on the old codebase.
try {
  await access(fileURLToPath(new URL('../api', import.meta.url)));
  throw new Error('Legacy api/ directory found. Use a clean source replacement for this static site; do not merge the old backend into this deployment.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
console.log(`Prepared ${await buildPublic()} allowlisted files for Vercel in dist/. No deployment performed.`);
