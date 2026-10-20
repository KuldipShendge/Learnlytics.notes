import { readFile, mkdir, copyFile, lstat, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLLH, publicConfig } from './build-llh.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
export function validatePublicPath(file) {
  const samples = ['pdfs/eda-handbook.pdf', 'pdfs/eda-practice-workbook.pdf', 'pdfs/eda-solution-manual.pdf'];
  if (typeof file !== 'string' || file.includes('\\') || file.includes('..') || file.startsWith('/') || file.includes(':') || file.split('/').some(p => p.startsWith('.'))) return false;
  if (/\.pdf$/i.test(file)) return samples.includes(file);
  return ['index.html', 'llh.html', 'robots.txt', 'sitemap.xml'].includes(file) || /^(assets|css|js)\//.test(file);
}
export async function buildPublic() {
  publicConfig(); // Fail before altering output if a secret key was supplied by mistake.
  const manifest = JSON.parse(await readFile(path.join(root, 'deployment/public-files.json'), 'utf8'));
  if (new Set(manifest).size !== manifest.length || !manifest.every(validatePublicPath)) throw new Error('Invalid public allowlist');
  for (const file of manifest) {
    // Reject symlinks at every level; public output cannot traverse into private paths.
    let candidate = root;
    for (const part of file.split('/')) {
      candidate = path.join(candidate, part);
      if ((await lstat(candidate)).isSymbolicLink()) throw new Error('Public symlinks are forbidden');
    }
    if (!(await lstat(candidate)).isFile()) throw new Error('Public allowlist must contain files only');
  }
  // Fixed, workspace-contained output only. Never accept a caller-supplied deletion path.
  if (path.resolve(output) !== path.resolve(root, 'dist')) throw new Error('Unsafe output');
  try { if ((await lstat(output)).isSymbolicLink()) throw new Error('Output cannot be a symlink'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const file of manifest) {
    const target = path.join(output, file);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(path.join(root, file), target);
  }
  await buildLLH(output);
  const config = publicConfig();
  const headers = (await readFile(path.join(root, 'deployment/headers.template'), 'utf8'))
    .replaceAll('{{SUPABASE_ORIGIN}}', config.supabaseUrl ? new URL(config.supabaseUrl).origin : "'none'");
  await writeFile(path.join(output, '_headers'), headers);
  return manifest.length + 2;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Prepared ${await buildPublic()} allowlisted public files in dist/. No deployment performed.`);
}
