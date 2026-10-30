import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { projectToolkits, toolkitLaunchLabel } from '../js/project-da-config.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const template = view => html.split(`<template id="view-${view}"`)[1].split('</template>')[0];

test('each edition announces its November launch without exposing prices or checkout', () => {
  for (const [edition, view, label] of [
    ['analyst', 'project', 'Coming soon on 4 Nov'],
    ['scientist', 'project-ds', 'Coming soon on 12 Nov'],
  ]) {
    assert.equal(toolkitLaunchLabel(projectToolkits[edition]), label);
    assert.match(template(view), new RegExp(label));
    assert.doesNotMatch(template(view), /₹|DIWALI|data-project-price|data-project-promo|rzp\.io/);
  }
});

test('DS preserves the DA parts, projects and chapter titles', () => {
  const content = view => template(view).match(/<div class="toolkit-projects">(.*?)<p class="toolkit-eligibility">/s)[1];
  assert.equal(content('project'), content('project-ds'));
  const parts = view => template(view).match(/<div class="toolkit-parts">(.*?)<section class="toolkit-section"/s)[1];
  assert.equal(parts('project'), parts('project-ds'));
});
