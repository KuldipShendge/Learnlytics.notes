import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, writeFile, unlink } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { buildPublic, validatePublicPath } from '../scripts/build-public.mjs';
import { publicConfig } from '../scripts/build-llh.mjs';
test('public artifact allowlist excludes private files, unexpected assets, paid PDFs and secrets',async()=>{
 const tracked = new Set(execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0'));
 const manifest = JSON.parse(await readFile('deployment/public-files.json','utf8'));
 assert.deepEqual(manifest.filter(file=>!tracked.has(file)),[], 'Every deployment input must exist in a clean Git checkout');
 const files=[];
 const walk=async dir=>{for(const entry of await readdir(dir,{withFileTypes:true})){const name=`${dir}/${entry.name}`;if(entry.isDirectory())await walk(name);else files.push(name);}};
 const sentinel='assets/llh-unlisted-test.txt';
 await writeFile(sentinel,'not-public');
 try {
  assert(!validatePublicPath('supabase/functions/.env'));
  assert(!validatePublicPath('dev/llh-demo.js'));
  assert(!validatePublicPath('../private'));
  assert(!validatePublicPath('assets/../private'));
  assert(!validatePublicPath('pdfs/paid-kit.pdf'));
  assert(!validatePublicPath('assets/paid-kit.pdf'));
  const previousDemo = process.env.LLH_DEMO;
  try {
   process.env.LLH_DEMO = '1'; // Even a developer's demo environment cannot affect deploy output.
   await buildPublic();
  } finally {
   if(previousDemo === undefined) delete process.env.LLH_DEMO; else process.env.LLH_DEMO = previousDemo;
  }
  await walk('dist');
  assert((await readFile('dist/llh.html','utf8')).includes('src="assets/vendor/llh-client.js"'));
  assert(files.includes('dist/llh.html'));
  assert(files.includes('dist/assets/vendor/llh-client.js'));
  assert(!files.some(p=>/supabase\/|scripts\/|tests\/|docs\/|\.env|unlisted-test|pnpm-lock/.test(p)));
  assert(!files.some(p=>/\/dev\/|__local|llh-demo/.test(p)));
  for (const file of files.filter(p=>/\.(html|js|css)$/.test(p))) {
   assert(!/LLH_DEMO|__local\/llh-demo|admin \/ admin|Open demo/.test(await readFile(file,'utf8')),`Demo code leaked into ${file}`);
  }
  assert.deepEqual(files.filter(p=>p.endsWith('.pdf')).sort(),['dist/pdfs/eda-handbook.pdf','dist/pdfs/eda-practice-workbook.pdf','dist/pdfs/eda-solution-manual.pdf']);
  const before=process.env.LLH_SUPABASE_PUBLISHABLE_KEY;
  const beforeUrl=process.env.LLH_SUPABASE_URL;
  try {
   process.env.LLH_SUPABASE_URL='https://project.supabase.co';process.env.LLH_SUPABASE_PUBLISHABLE_KEY='sb_secret_never_publish';
   assert.throws(publicConfig,/Invalid LLH public configuration/);
  } finally {
   if(before===undefined)delete process.env.LLH_SUPABASE_PUBLISHABLE_KEY;else process.env.LLH_SUPABASE_PUBLISHABLE_KEY=before;
   if(beforeUrl===undefined)delete process.env.LLH_SUPABASE_URL;else process.env.LLH_SUPABASE_URL=beforeUrl;
  }
 } finally {await unlink(sentinel);}
});
test('temporary payment links match all four kits and existing prices remain unchanged',async()=>{
 const head=execFileSync('git',['show','HEAD:index.html'],{encoding:'utf8'});
 const current=await readFile('index.html','utf8');
 const prices=html=>html.match(/₹[\d,]+/g);
 assert.deepEqual(prices(current),prices(head));
 const catalog=await readFile('js/catalog.js','utf8');
 assert.deepEqual(catalog.match(/price: '[^']+'/g),execFileSync('git',['show','HEAD:js/catalog.js'],{encoding:'utf8'}).match(/price: '[^']+'/g));
 const links={analyst:'S2y4eZ3',scientist:'fain7HM',engineer:'6j2zp8fF',complete:'qLYK5iB'};
 for(const [kit,id] of Object.entries(links)) {
  const section=current.match(new RegExp(`<template\\b[^>]*id="view-${kit}"[\\s\\S]*?</template>`))[0];
  const anchors=section.match(/<a\b[^>]*data-checkout[^>]*>/g);
  assert.equal(anchors.length,4);
  for(const anchor of anchors) {
   assert(anchor.includes(`href="https://rzp.io/rzp/${id}"`));
   assert(anchor.includes('target="_blank"'));
   assert(anchor.includes('rel="noopener noreferrer"'));
  }
 }
});
