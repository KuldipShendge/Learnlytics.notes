// LOCAL PREVIEW ONLY. Served by the loopback preview server with LLH_DEMO=1.
// Not imported by the real auth client, and excluded from the public allowlist.
import { libraryCards } from '../js/llh-library-ui.js';
import { learningExperienceContent, renderHubPreview } from '../js/learning-experience.js';

if (!['localhost', '127.0.0.1'].includes(location.hostname)) throw new Error('Local preview only');
const $ = id => document.getElementById(id);
let signedIn = false;
let selected = 'complete';
const kits = [
  { id: 'analyst', name: 'Data Analyst Kit', description: 'Build confidence with Excel, SQL, Python and business dashboards.' },
  { id: 'scientist', name: 'Data Scientist & Gen AI Kit', description: 'Prepare across statistics, machine learning, deep learning and Gen AI.' },
  { id: 'engineer', name: 'Machine Learning Engineer Kit', description: 'Explore model evaluation, deployment and production ML workflows.' },
];
const labels = { analyst: 'DA-only buyer', scientist: 'DS-only buyer', engineer: 'ML-only buyer', complete: 'Combined Kit buyer' };

document.title = 'Demo Preview | LearnLytics Learning Hub';
document.querySelector('.llh-intro').insertAdjacentHTML('afterbegin', '<p class="llh-demo-badge">Demo Preview · Local only</p>');
document.querySelector('.llh-intro > p:last-child').textContent = 'Explore your Learning Hub with sample data. Nothing here creates an account, purchase or real kit access.';
document.querySelector('.llh-tabs').hidden = true;
document.querySelector('.llh-auth-links').hidden = true;
document.querySelector('#llh-auth > .llh-hint').textContent = 'Preview credentials: admin / admin. This is a visual demo, not an administrator account.';
$('auth-title').textContent = 'Try the Learning Hub';
$('auth-description').textContent = 'Sign in to explore sample libraries and tracker previews.';
document.querySelector('label[for="llh-email"]').textContent = 'Username';
$('llh-email').type = 'text';
$('llh-email').autocomplete = 'off';
$('llh-password').autocomplete = 'off';
$('auth-submit').textContent = 'Open demo';
$('llh-auth').hidden = false;
$('refresh-library').hidden = true;
document.querySelector('.llh-help').textContent = 'Demo resources and progress are illustrative. Reloading or signing out resets this preview.';

const controls = document.createElement('div');
controls.className = 'llh-demo-controls';
controls.innerHTML = `<div><label for="demo-kit">Preview a buyer’s library</label><p>Switch access to compare each kit.</p></div>
  <select id="demo-kit">${Object.entries(labels).map(([id, label]) => `<option value="${id}">${label}</option>`).join('')}</select>`;
$('library-summary').before(controls);
const trackers = document.createElement('section');
trackers.className = 'llh-demo-trackers';
trackers.setAttribute('aria-label', 'Study and career tracker previews');
$('library-kits').after(trackers);
const dialog = document.createElement('dialog');
dialog.className = 'llh-panel llh-demo-dialog';
dialog.setAttribute('aria-labelledby', 'demo-resource-title');
dialog.innerHTML = '<p class="llh-demo-badge">Demo Preview</p><h2 id="demo-resource-title">Sample resource</h2><p>This is an illustrative resource card. Paid documents and download links are not connected in this preview.</p><button class="button" type="button">Back to library</button>';
document.body.append(dialog);
dialog.querySelector('button').addEventListener('click', () => dialog.close());

function render() {
  if (!signedIn) return;
  $('llh-auth').hidden = true;
  $('llh-library').hidden = false;
  $('account-email').textContent = 'Sample learner · Demo account';
  $('demo-kit').value = selected;
  $('library-summary').textContent = selected === 'complete'
    ? 'Combined Kit access — Data Science + Gen AI and ML Engineering, with Data Analyst bonus access.'
    : `${labels[selected]} — one accessible kit. Other kits are locked in this preview.`;
  $('library-kits').innerHTML = libraryCards(kits.map(kit => ({
    ...kit, accessible: selected === 'complete' || selected === kit.id,
    resources: ['Interview Handbook', 'Practice Workbook', 'Solution Manual'].map((title, i) => ({
      id: `${kit.id}-${i}`, title, format: 'PDF · Demo', size_bytes: [12582912, 4194304, 8388608][i],
    })),
  })));
  // Reuse the marketing site's existing tracker components and curriculum examples.
  const template = document.createElement('template');
  template.innerHTML = renderHubPreview(learningExperienceContent[selected], selected);
  trackers.replaceChildren(
    template.content.querySelector('.hub-preview-study'),
    template.content.querySelector('.hub-preview-career'),
  );
  trackers.querySelector('.hub-example-label').textContent = 'PREVIEW';
  trackers.querySelector('.hub-preview-career h3').insertAdjacentHTML('beforeend', '<span class="hub-example-label">PREVIEW</span>');
}

$('auth-form').addEventListener('submit', event => {
  event.preventDefault();
  if ($('llh-email').value.trim() !== 'admin' || $('llh-password').value !== 'admin') {
    $('llh-message').textContent = 'Use the local preview username and password shown below.';
    $('llh-password').value = '';
    return;
  }
  signedIn = true;
  $('auth-form').reset();
  $('llh-message').textContent = '';
  render();
});
$('demo-kit').addEventListener('change', event => {
  if (!signedIn || !Object.hasOwn(labels, event.target.value)) return;
  selected = event.target.value;
  render();
});
$('library-kits').addEventListener('click', event => {
  const button = event.target.closest('[data-resource-id]');
  if (!signedIn || !button) return;
  $('demo-resource-title').textContent = button.closest('li').querySelector('strong').textContent;
  dialog.showModal();
});
$('sign-out').addEventListener('click', () => {
  signedIn = false;
  selected = 'complete';
  dialog.close();
  $('library-kits').replaceChildren();
  trackers.replaceChildren();
  $('account-email').textContent = '';
  $('llh-library').hidden = true;
  $('llh-auth').hidden = false;
  $('llh-message').textContent = 'Demo signed out. All preview state has been reset.';
  $('llh-email').focus();
});
