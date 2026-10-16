import { setupInlineVideos } from './inline-videos.js?v=compact-guides-20261015';
import { setupDialog } from './dialog.js';
import { setupSampleGallery } from './sample-gallery.js?v=da-page-20261016';
import { curriculum as dsCurriculum, productOverview as dsOverview } from './ds-curriculum.js';
import { productReviews } from './product-reviews.js?v=reviews-carousel-20261016';
import { setupProductTestimonials } from './product-testimonials.js?v=reviews-carousel-20261016';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const resources = '<div class="part-resources"><span>Handbook</span><span>Practice workbook</span><span>Solution manual</span></div>';

export function setupProduct({ curriculum = dsCurriculum, productOverview = dsOverview, kit = 'scientist' } = {}) {
  setupInlineVideos();
  setupSampleGallery({ resources: productOverview.samples });

  const curriculumSection = document.querySelector('#curriculum');
  const includedSection = document.querySelector('.included-section');
  const secondaryColumn = document.querySelector('.product-secondary');
  const desktopLayout = window.matchMedia('(min-width: 980px)');
  function placeCurriculum() {
    if (desktopLayout.matches) secondaryColumn.prepend(curriculumSection);
    else includedSection.after(curriculumSection);
  }
  placeCurriculum();
  desktopLayout.addEventListener('change', placeCurriculum);

  document.querySelectorAll('[data-question-total]').forEach((element) => {
    element.textContent = `${productOverview.practiceQuestions.toLocaleString('en-IN')}+`;
  });

  setupProductTestimonials(productReviews[kit]);

  // All content comes from the local editorial curriculum, never user input.
  document.querySelector('#curriculum-list').innerHTML = curriculum
    .map(
      (module) => `
    <details class="curriculum-module">
      <summary><span class="module-number" aria-hidden="true">${String(module.number).padStart(2, '0')}</span><span class="module-heading"><span class="module-topic">MODULE ${String(module.number).padStart(2, '0')}</span><strong>${escapeHtml(module.title)}</strong><span class="module-meta"><span>${module.units ? `${module.units.length} units` : `${module.parts.length} parts`}</span><span>${module.units ? `${module.topics} topics` : `${module.questions.toLocaleString('en-IN')}+ practice questions`}</span></span></span><svg class="icon"><use href="assets/icons/product.svg#chevron"/></svg></summary>
      <ol class="module-parts">${module.units ? module.units.map((unit, index) => `<li><span class="part-label">UNIT ${String(index + 1).padStart(2, '0')}</span><details class="curriculum-unit"><summary><strong>${escapeHtml(unit.title)}</strong><span>${unit.topics.length} topics</span></summary>${unit.subtitle ? `<p class="curriculum-unit-focus">${escapeHtml(unit.subtitle)}</p>` : ''}<ul class="curriculum-topics">${unit.topics.map(topic => `<li>${escapeHtml(topic)}</li>`).join('')}</ul></details></li>`).join('') : module.parts.map((part, index) => `<li><span class="part-label">PART ${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(part.title)}</strong><div class="part-stats"><span><b>${part.questions}+</b> practice questions</span><span><b>${part.pages}+</b> handbook pages</span></div>${resources}</li>`).join('')}</ol>
      ${module.units ? `<div class="module-resource-pills">${resources}</div>` : ''}
    </details>
  `,
    )
    .join('');

  const checkout = setupDialog(document.querySelector('#checkout-dialog'));
  document
    .querySelectorAll('[data-checkout]')
    .forEach((button) => button.addEventListener('click', () => checkout.open()));
}
