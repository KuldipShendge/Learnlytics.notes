import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import http from 'node:http';

test('demo requires local server opt-in; normal auth and remote hosts cannot enable it', async () => {
  const children = [];
  async function start(demo, port) {
    const child = spawn(process.execPath, ['scripts/preview.mjs'], {
      env: { ...process.env, PORT: String(port), PREVIEW_BASE_PATH: '/Learnlytics.notes', LLH_DEMO: demo ? '1' : '' },
      stdio: ['ignore','pipe','pipe'],
    });
    children.push(child);
    await Promise.race([
      once(child.stdout, 'data'),
      once(child, 'exit').then(() => { throw new Error('Preview server exited'); }),
      new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('Server startup timed out')), 10000); timer.unref(); }),
    ]);
    return `http://127.0.0.1:${port}/Learnlytics.notes/`;
  }
  try {
    const normal = await start(false, 4201);
    const demo = await start(true, 4202);
    const normalHTML = await (await fetch(`${normal}llh.html?demo=1`)).text();
    assert(normalHTML.includes('src="assets/vendor/llh-client.js"'));
    assert(!normalHTML.includes('__local'));
    assert.equal((await fetch(`${normal}__local/llh-demo.js`)).status,404);
    assert.equal((await fetch(`${normal}assets/%2e%2e%2fdev/llh-demo.js`)).status,403);
    const response = await fetch(`${demo}llh.html`);
    const demoHTML = await response.text();
    assert(demoHTML.includes('src="__local/llh-demo.js"'));
    assert(!demoHTML.includes('assets/vendor/llh-client.js'));
    assert(response.headers.get('content-security-policy').includes("connect-src 'none'"));
    assert.equal((await fetch(`${demo}__local/llh-demo.js`)).status,200);
    assert.equal((await fetch(`${demo}dev/llh-demo.js`)).status,404);
    assert.equal((await fetch(`${demo}supabase/config.toml`)).status,404);
    // Explicit Host through http.request simulates a DNS-rebound/proxy request.
    const foreignHostStatus = await new Promise((resolve,reject) => {
      const request = http.get(`${demo}llh.html`, {headers:{Host:'example.com'}}, response => {
        response.resume(); resolve(response.statusCode);
      });
      request.on('error',reject);
    });
    assert.equal(foreignHostStatus,403);
    const source = await readFile('dev/llh-demo.js','utf8');
    assert(!/createClient|localStorage|sessionStorage|fetch\(|XMLHttpRequest|indexedDB/.test(source));
    const page = await readFile('index.html','utf8');
    const headers = page.match(/<header\b[\s\S]*?<\/header>/g);
    assert.equal(headers.length,8);
    for (const header of headers) {
      assert.match(header, /<\/a><a class="header-llh-link" href="llh.html"/);
      assert.equal((header.match(/header-llh-link/g)||[]).length,1);
    }
  } finally {
    await Promise.all(children.map(async child => { if(child.exitCode === null) { child.kill(); await once(child,'exit'); } }));
  }
});
