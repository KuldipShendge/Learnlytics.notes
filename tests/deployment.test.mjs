import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { legacyEntryView } from '../js/legacy-entry.js';

test('Vercel migration configuration, old-link destinations and public artifact are consistent', async () => {
  const config = JSON.parse(await readFile('vercel.json','utf8'));
  assert.equal(config.framework,null);
  assert.equal(config.outputDirectory,'dist');
  assert.equal(config.buildCommand,'node scripts/build-vercel.mjs');
  assert.equal(config.installCommand,'pnpm install --frozen-lockfile --ignore-scripts');
  assert.equal(config.cleanUrls,false,'Keep the existing llh.html URL');
  assert(!config.rewrites && !config.routes,'Unknown URLs must not be rewritten to a homepage');
  const sources = config.redirects.map(rule=>rule.source);
  assert.equal(new Set(sources).size,sources.length);
  const expected = {
    '/course-bundles/data-bi-analyst-interview-kit':'analyst',
    '/course-bundles/data-scientist-genai-engineer-bundle':'scientist',
    '/course-bundles/machine-learning-interview-kit':'engineer',
    '/course-bundles/ds-genai-ml-complete-kit':'complete',
    '/free-ml-part-01.html':'resources',
    '/reviews':'reviews',
  };
  for(const rule of config.redirects) {
    assert.equal(rule.permanent,true);
    assert(rule.source.startsWith('/') && !rule.source.includes('*'));
    const destination=new URL(rule.destination,'https://learnlyticshandbook.shop');
    assert.equal(destination.origin,'https://learnlyticshandbook.shop');
    assert.equal(destination.pathname,'/');
    assert(destination.hash==='#career-goal' || legacyEntryView(destination.hash));
  }
  for(const [source,view] of Object.entries(expected)) {
    const rule=config.redirects.find(rule=>rule.source===source);
    assert(rule,source);
    assert.equal(legacyEntryView(new URL(rule.destination,'https://learnlyticshandbook.shop').hash),view);
  }
  assert.equal(legacyEntryView('#kit-admin'),null);
  assert.equal(legacyEntryView('#__proto__'),null);
  const authHeaders=Object.fromEntries(config.headers.find(rule=>rule.source==='/llh.html').headers.map(h=>[h.key,h.value]));
  assert.equal(authHeaders['Cache-Control'],'no-store');
  assert.equal(authHeaders['X-Robots-Tag'],'noindex, nofollow');
  assert(authHeaders['Content-Security-Policy'].includes("frame-ancestors 'none'"));
  assert(!authHeaders['Content-Security-Policy'].includes("'unsafe-inline'"));
  const sitemap=await readFile('dist/sitemap.xml','utf8');
  assert(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),['https://learnlyticshandbook.shop/']);
  const robots=await readFile('dist/robots.txt','utf8');
  assert(robots.includes('Sitemap: https://learnlyticshandbook.shop/sitemap.xml'));
  assert(robots.includes('Disallow: /llh.html'));
  const html=await readFile('dist/index.html','utf8');
  assert(html.includes('name="google-site-verification"'));
  assert(html.includes('rel="canonical" href="https://learnlyticshandbook.shop/"'));
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema['@type'],'Organization');
  assert(!('aggregateRating' in schema));
  const files=[];
  async function walk(dir) {
    for(const entry of await readdir(dir,{withFileTypes:true})) {
      const name=`${dir}/${entry.name}`;
      if(entry.isDirectory()) await walk(name); else files.push(name);
    }
  }
  await walk('dist');
  assert(!files.some(file=>/\/(dev|api|server|supabase|tests|scripts)\//.test(file)));
  assert(!files.some(file=>/\.env|vercel\.json|llh-demo/.test(file)));
  for(const asset of ['assets/images/hero-learning.png','assets/images/logo.webp','assets/images/favicon.webp','js/legacy-entry.js']) {
    assert(files.includes(`dist/${asset}`),`Missing deployment attachment: ${asset}`);
  }
  console.log('Verified 24 legacy redirects and all deployment metadata; hosted Vercel routing still requires a preview deployment.');
});
