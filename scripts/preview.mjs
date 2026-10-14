import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const pages = new Map([
  ['/', '/index.html'],
  ['/index.html', '/index.html'],
  ['/about-us', '/about.html'],
  ['/about-us/', '/about.html'],
  ['/about.html', '/about.html'],
  ['/data-scientist-genai.html', '/data-scientist-genai.html'],
  ['/course-bundles/data-scientist-genai-engineer-bundle', '/data-scientist-genai.html'],
  ['/course-bundles/data-scientist-genai-engineer-bundle/', '/data-scientist-genai.html'],
]);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    // Serve only registered pages and public assets, never project tooling.
    if (!pages.has(pathname) && !/^\/(assets|css|js)\//.test(pathname)) {
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
server.listen(port, '127.0.0.1', () => console.log(`LearnLytics preview: http://127.0.0.1:${port}`));
