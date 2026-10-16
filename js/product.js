import { setupInlineVideos } from './inline-videos.js?v=compact-guides-20261015';
import { setupDialog } from './dialog.js';
import { setupSampleGallery } from './sample-gallery.js?v=inline-pdf-samples-20261016';
import { curriculum, productOverview } from './ds-curriculum.js';

export function setupProduct() {
  setupInlineVideos();
  setupSampleGallery();

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

  // All content comes from the local editorial curriculum, never user input.
  document.querySelector('#curriculum-list').innerHTML = curriculum
    .map(
      (module) => `
    <details class="curriculum-module">
      <summary><span class="module-number" aria-hidden="true">${String(module.number).padStart(2, '0')}</span><span class="module-heading"><span class="module-topic">MODULE ${String(module.number).padStart(2, '0')}</span><strong>${module.title}</strong><span class="module-meta"><span>${module.parts.length} parts</span><span>${module.questions.toLocaleString('en-IN')}+ practice questions</span></span></span><svg class="icon"><use href="assets/icons/product.svg#chevron"/></svg></summary>
      <ol class="module-parts">${module.parts.map((part, index) => `<li><span class="part-label">PART ${String(index + 1).padStart(2, '0')}</span><strong>${part.title}</strong><div class="part-stats"><span><b>${part.questions}+</b> practice questions</span><span><b>${part.pages}+</b> handbook pages</span></div><div class="part-resources" aria-label="Resources included"><span>Handbook</span><span>Practice workbook</span><span>Solution manual</span></div></li>`).join('')}</ol>
    </details>
  `,
    )
    .join('');

  const checkout = setupDialog(document.querySelector('#checkout-dialog'));
  document
    .querySelectorAll('[data-checkout]')
    .forEach((button) => button.addEventListener('click', () => checkout.open()));
}
