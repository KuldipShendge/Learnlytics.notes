import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { viewPaths, hubPath } from '../js/site-routes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
// Set PREVIEW_BASE_PATH=/Learnlytics.notes to reproduce GitHub project hosting.
const basePath = (process.env.PREVIEW_BASE_PATH || '').replace(/\/$/, '');
// Explicit local process opt-in, never a browser flag or production auth fallback.
const demoEnabled = process.env.LLH_DEMO === '1';
const samplePaths = new Set([
  '/pdfs/eda-handbook.pdf', '/pdfs/eda-practice-workbook.pdf', '/pdfs/eda-solution-manual.pdf',
  '/pdfs/mlops-handbook-v2.pdf', '/pdfs/mlops-workbook-v2.pdf', '/pdfs/mlops-solutions-v2.pdf',
  '/pdfs/math-solutions-v2.pdf', '/pdfs/math-workbook-v2.pdf', '/pdfs/math-handbook-v2.pdf',
  '/pdfs/BI-handbook-v2.pdf', '/pdfs/BI-workbook-v2.pdf', '/pdfs/BI-solution-v2.pdf',
]);
const demoFiles = new Map([
  ['/__local/llh-demo.js', 'dev/llh-demo.js'],
  ['/__local/llh-demo.css', 'dev/llh-demo.css'],
]);
const pages = new Map([
  ['/', '/index.html'],
  ['/index.html', '/index.html'],
  ['/llh.html', '/llh.html'],
  ['/robots.txt', '/robots.txt'],
  ['/sitemap.xml', '/sitemap.xml'],
]);
for (const slug of Object.values(viewPaths).filter(Boolean)) pages.set(`/${slug}`, '/index.html');
pages.set(`/${hubPath}`, '/llh.html');
const vercel = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
const types = { '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.pdf': 'application/pdf' };
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    // Reject remote/rebound Host names even when a proxy forwards to this loopback server.
    const requestHost = new URL(`http://${request.headers.host}`).hostname;
    if (!['127.0.0.1', 'localhost'].includes(requestHost)) {
      response.writeHead(403); response.end('Local preview only'); return;
    }
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.includes('\\') || pathname.split('/').some(part => part === '..' || part === '.')) {
      response.writeHead(403); response.end('Invalid path'); return;
    }
    if (basePath) {
      if (pathname === basePath) {
        response.writeHead(308, { Location: `${basePath}/` }); response.end(); return;
      }
      if (!pathname.startsWith(`${basePath}/`)) {
        response.writeHead(404); response.end('Not found'); return;
      }
      pathname = pathname.slice(basePath.length);
    }
    const oldRoute = vercel.redirects.find(rule => rule.source === pathname);
    if (oldRoute) {
      const query = new URL(request.url, 'http://localhost').search;
      const target = new URL(oldRoute.destination, 'http://localhost');
      response.writeHead(308, { Location: basePath + target.pathname + query + target.hash });
      response.end(); return;
    }
    if (pathname !== '/' && pathname.endsWith('/') && pages.has(pathname.slice(0, -1))) {
      response.writeHead(308, { Location: basePath + pathname.slice(0, -1) + new URL(request.url, 'http://localhost').search });
      response.end(); return;
    }
    if (demoEnabled && demoFiles.has(pathname)) {
      response.writeHead(200, { 'Content-Type': types[path.extname(pathname)], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      response.end(request.method === 'HEAD' ? '' : await readFile(path.join(root, demoFiles.get(pathname)))); return;
    }
    if (demoEnabled && pages.get(pathname) === '/llh.html') {
      const html = (await readFile(path.join(root, 'llh.html'), 'utf8'))
        .replace('<script type="module" src="assets/vendor/llh-client.js"></script>',
          '<link rel="stylesheet" href="css/learning-experience.css" /><link rel="stylesheet" href="__local/llh-demo.css" /><script type="module" src="__local/llh-demo.js"></script>');
      response.writeHead(200, { 'Content-Type': types['.html'], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'",
        'Referrer-Policy': 'no-referrer' });
      response.end(request.method === 'HEAD' ? '' : html); return;
    }
    // Serve only registered pages and public assets, never project tooling.
    if (!pages.has(pathname) && !/^\/(assets|css|js)\//.test(pathname) && !samplePaths.has(pathname)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    const file = path.resolve(root, '.' + (pages.get(pathname) || pathname));
    if (!file.startsWith(root + path.sep) || /(^|[\\/])\./.test(path.relative(root, file))) {
      response.writeHead(403); response.end(); return;
    }
    if (!(await stat(file)).isFile()) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    if (request.method === 'HEAD') { response.end(); return; }
    createReadStream(file).pipe(response);
  } catch { response.writeHead(404); response.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`LearnLytics preview: http://127.0.0.1:${port}${basePath}/`));
