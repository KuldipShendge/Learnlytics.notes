import { libraryCards } from './llh-library-ui.js';
import { learningExperienceContent, renderHubPreview } from './learning-experience.js';

// Public presentation only: no account, entitlement, persistence or resource URL.
export function showPublicPreview() {
  const $ = id => document.getElementById(id);
  const kits = [
    { id: 'analyst', name: 'Data Analyst Kit', description: 'Build confidence with Excel, SQL, Python and business dashboards.' },
    { id: 'scientist', name: 'Data Scientist & Gen AI Kit', description: 'Prepare across statistics, machine learning, deep learning and Gen AI.' },
    { id: 'engineer', name: 'Machine Learning Engineer Kit', description: 'Explore model evaluation, deployment and production ML workflows.' },
  ];
  const labels = { analyst: 'Data Analyst Kit', scientist: 'Data Scientist & Gen AI Kit', engineer: 'Machine Learning Engineer Kit', complete: 'Combined Kit' };
  document.title = 'Learning Hub Preview | LearnLytics';
  document.querySelector('.llh-intro').insertAdjacentHTML('afterbegin', '<p class="llh-preview-badge">Public preview</p>');
  document.querySelector('.llh-intro > p:last-child').textContent = 'Explore the Learning Hub library and trackers. This preview uses illustrative content; sign-in, saved progress and paid resources are not available here.';
  $('llh-message').textContent = '';
  $('llh-auth').hidden = true;
  $('llh-link').hidden = true;
  document.querySelector('.llh-account-actions').hidden = true;
  $('account-email').textContent = 'Library preview · No account required';
  document.querySelector('.llh-help').textContent = 'Resources and progress shown here are illustrative. Purchases continue through the existing Razorpay Payment Pages on our website.';

  const controls = document.createElement('div');
  controls.className = 'llh-preview-controls';
  controls.innerHTML = `<div><label for="preview-kit">Explore a kit’s library</label><p>Switch kits to explore the library and tracker layout.</p></div>
    <select id="preview-kit">${Object.entries(labels).map(([id, label]) => `<option value="${id}">${label}</option>`).join('')}</select>`;
  $('library-summary').before(controls);
  const trackers = document.createElement('section');
  trackers.className = 'llh-preview-trackers';
  trackers.setAttribute('aria-label', 'Study and career tracker previews');
  $('library-kits').after(trackers);
  const dialog = document.createElement('dialog');
  dialog.className = 'llh-panel llh-preview-dialog';
  dialog.setAttribute('aria-labelledby', 'preview-resource-title');
  dialog.innerHTML = '<p class="llh-preview-badge">Public preview</p><h2 id="preview-resource-title">Resource details</h2><p>This card illustrates the library layout. Paid files are not available in this preview. For an existing purchase, contact LearnLytics for access.</p><button class="button" type="button">Back to library</button>';
  document.body.append(dialog);
  dialog.querySelector('button').addEventListener('click', () => dialog.close());

  function render(selected) {
    $('preview-kit').value = selected;
    $('library-summary').textContent = selected === 'complete'
      ? 'Combined Kit preview — Data Science + Gen AI and ML Engineering, with Data Analyst bonus content.'
      : `${labels[selected]} preview — explore this kit’s library below.`;
    $('library-kits').innerHTML = libraryCards(kits.map(kit => ({
      ...kit, accessible: selected === 'complete' || selected === kit.id,
      resources: ['Interview Handbook', 'Practice Workbook', 'Solution Manual'].map((title, index) => ({ id: `${kit.id}-${index}`, title, format: 'PDF · Preview' })),
    })));
    for (const card of $('library-kits').children) {
      card.querySelector('.llh-kit-status').textContent = card.classList.contains('is-locked') ? 'Other kit' : 'Preview';
      const unavailable = card.querySelector('.llh-unavailable');
      if (unavailable) unavailable.textContent = 'Select this kit above to explore its preview.';
    }
    for (const button of $('library-kits').querySelectorAll('[data-resource-id]')) {
      button.removeAttribute('data-resource-id');
      button.dataset.previewResource = '';
      button.textContent = 'Resource details';
    }
    const template = document.createElement('template');
    template.innerHTML = renderHubPreview(learningExperienceContent[selected], selected);
    trackers.replaceChildren(template.content.querySelector('.hub-preview-study'), template.content.querySelector('.hub-preview-career'));
    trackers.querySelector('.hub-example-label').textContent = 'PREVIEW';
    trackers.querySelector('.hub-preview-career h3').insertAdjacentHTML('beforeend', '<span class="hub-example-label">PREVIEW</span>');
  }
  $('preview-kit').addEventListener('change', event => {
    if (Object.hasOwn(labels, event.target.value)) render(event.target.value);
  });
  $('library-kits').addEventListener('click', event => {
    const button = event.target.closest('[data-preview-resource]');
    if (!button) return;
    $('preview-resource-title').textContent = button.closest('li').querySelector('strong').textContent;
    dialog.showModal();
  });
  render('complete');
  $('llh-library').hidden = false;
}
