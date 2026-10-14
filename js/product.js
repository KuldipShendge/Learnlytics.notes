import { setupVideos } from './videos.js';
import { setupDialog } from './dialog.js';
import { setupSampleGallery } from './sample-gallery.js';
import { curriculum, productOverview } from './ds-curriculum.js';

export function setupProduct() {
  setupVideos();
  setupSampleGallery();

  document.querySelectorAll('[data-question-total]').forEach((element) => {
    element.textContent = `${productOverview.practiceQuestions.toLocaleString('en-IN')}+`;
  });

  // All content comes from the local editorial curriculum, never user input.
  document.querySelector('#curriculum-list').innerHTML = curriculum
    .map(
      (module) => `
    <details class="curriculum-module">
      <summary><span class="module-number">${module.number}</span><span class="module-heading"><strong>${module.title}</strong><span>${module.parts.length} parts · ${module.questions.toLocaleString('en-IN')}+ practice questions</span></span><svg class="icon"><use href="assets/icons/product.svg#chevron"/></svg></summary>
      <ol class="module-parts">${module.parts.map((part, index) => `<li><span class="part-label">PART ${index + 1}</span><strong>${part.title}</strong><p>${part.questions}+ practice questions · ${part.pages}+ handbook pages</p><p>Handbook + Practice workbook + Solution manual</p></li>`).join('')}</ol>
    </details>
  `,
    )
    .join('');

  const checkout = setupDialog(document.querySelector('#checkout-dialog'));
  document
    .querySelectorAll('[data-checkout]')
    .forEach((button) => button.addEventListener('click', () => checkout.open()));
}
