import { readFile, writeFile } from 'node:fs/promises';

const themes = { blue: '#0b123f', plum: '#241525' };
const theme = process.argv[2];
if (!Object.hasOwn(themes, theme)) {
  console.error('Use: node scripts/set-theme.mjs blue (or plum)');
  process.exit(1);
}
const file = new URL('../index.html', import.meta.url);
const source = await readFile(file, 'utf8');
if (!/<html\b[^>]*data-theme="(?:blue|plum)"/.test(source) ||
    !/<meta name="theme-color" content="#[a-f0-9]+"\s*\/>/i.test(source)) {
  throw new Error('Theme markers are missing. No files were changed.');
}
const updated = source
  .replace(/(<html\b[^>]*data-theme=")(?:blue|plum)(")/, `$1${theme}$2`)
  .replace(/(<meta name="theme-color" content=")#[a-f0-9]+("\s*\/>)/i, `$1${themes[theme]}$2`);
if (updated !== source) await writeFile(file, updated);
console.log(`${theme === 'blue' ? 'Blue colour test' : 'Original plum palette'} selected. Refresh the local preview.`);
console.log('For the live website, commit and push index.html.');
