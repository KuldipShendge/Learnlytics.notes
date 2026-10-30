import { setupKitJourney } from './kit-journey.js?v=journey-20261019';
import { setupLearningExperience } from './learning-experience.js?v=toolkit-ml-kit-links-20261030';
import { setupInlineVideos } from './inline-videos.js?v=guide-covers-logo-20261016';
import { setupSampleGallery } from './sample-gallery.js?v=course-samples-20261028';
import { curriculum as dsCurriculum, productOverview as dsOverview } from './ds-curriculum.js';
import { productReviews } from './product-reviews.js?v=complete-kit-20261019';
import { setupProductTestimonials } from './product-testimonials.js?v=mobile-reviews-20261019';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const resources = '<div class="part-resources"><span>Handbook</span><span>Practice workbook</span><span>Solution manual</span></div>';

export function setupProduct({ curriculum = dsCurriculum, productOverview = dsOverview, kit = 'scientist' } = {}) {
  setupKitJourney();
  setupLearningExperience(kit);
  setupInlineVideos();
  setupSampleGallery({ resources: productOverview.samples });

  const sticky = document.querySelector('.product-sticky');
  const hero = document.querySelector('.product-hero');
  const header = document.querySelector('.site-header');
  let stickyFrame;
  const updateSticky = () => {
    cancelAnimationFrame(stickyFrame);
    stickyFrame = requestAnimationFrame(() => {
      const show = hero.isConnected && window.scrollY > 0 && hero.getBoundingClientRect().bottom <= (header?.getBoundingClientRect().bottom || 0);
      sticky.classList.toggle('is-visible', show);
      sticky.inert = !show;
    });
  };
  sticky.inert = true;
  window.addEventListener('scroll', updateSticky, { passive: true });
  window.addEventListener('resize', updateSticky);
  new ResizeObserver(updateSticky).observe(hero);
  document.querySelector('#app').addEventListener('learnlytics:view-enter', updateSticky);
  document.querySelector('#app').addEventListener('learnlytics:view-leave', () => {
    cancelAnimationFrame(stickyFrame);
    sticky.classList.remove('is-visible');
    sticky.inert = true;
  });
  updateSticky();

  const curriculumSection = document.querySelector('#curriculum');
  const includedSection = document.querySelector('.included-section');
  const secondaryColumn = document.querySelector('.product-secondary-content');
  const primaryColumn = document.querySelector('.product-primary-content');
  const differenceSection = document.querySelector('.difference-section');
  const audienceSection = document.querySelector('.audience-section');
  const supportSection = document.querySelector('.support-section');
  const desktopLayout = window.matchMedia('(min-width: 980px)');
  function placeProductSections() {
    if (desktopLayout.matches) {
      secondaryColumn.prepend(curriculumSection);
      supportSection.before(differenceSection, audienceSection);
    } else {
      includedSection.after(curriculumSection);
      // Preserve the single-column reading order on mobile.
      primaryColumn.append(differenceSection, audienceSection);
    }
  }
  placeProductSections();
  desktopLayout.addEventListener('change', placeProductSections);

  document.querySelectorAll('[data-question-total]').forEach((element) => {
    element.textContent = `${productOverview.practiceQuestions.toLocaleString('en-IN')}+`;
  });

  setupProductTestimonials(productReviews[kit]);

  // All content comes from the local editorial curriculum, never user input.
  document.querySelector('#curriculum-list').innerHTML = curriculum
    .map(
      (module) => `
    <details class="curriculum-module">
      <summary><span class="module-number" aria-hidden="true">${String(module.number).padStart(2, '0')}</span><span class="module-heading"><span class="module-topic">MODULE ${String(module.number).padStart(2, '0')}</span><strong>${escapeHtml(module.title)}</strong><span class="module-meta"><span>${module.units ? `${module.units.length} units` : `${module.parts.length} parts`}</span><span>${module.units ? `${module.topics} topics` : (module.questions == null ? escapeHtml(module.focus) : `${module.questions.toLocaleString('en-IN')}+ practice questions`)}</span></span></span><svg class="icon"><use href="assets/icons/product.svg#chevron"/></svg></summary>
      <ol class="module-parts">${module.units ? module.units.map((unit, index) => `<li><span class="part-label">UNIT ${String(index + 1).padStart(2, '0')}</span><details class="curriculum-unit"><summary><strong>${escapeHtml(unit.title)}</strong><span>${unit.topics.length} topics</span></summary>${unit.subtitle ? `<p class="curriculum-unit-focus">${escapeHtml(unit.subtitle)}</p>` : ''}<ul class="curriculum-topics">${unit.topics.map(topic => `<li>${escapeHtml(topic)}</li>`).join('')}</ul></details></li>`).join('') : module.parts.map((part, index) => `<li><span class="part-label">PART ${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(part.title)}</strong>${part.description ? `<p class="curriculum-part-description">${escapeHtml(part.description)}</p>` : `<div class="part-stats"><span><b>${part.questions}+</b> practice questions</span><span><b>${part.pages}+</b> handbook pages</span></div>${resources}`}</li>`).join('')}</ol>
      ${module.units ? `<div class="module-resource-pills">${resources}</div>` : ''}
    </details>
  `,
    )
    .join('');

  // Fill the existing sidebar space through the last review row on wider screens.
  // Observe only content above the toolkit so changing its height cannot loop.
  if (kit !== 'analyst') {
    const tools = document.querySelector('.tools-section');
    const reviews = document.querySelector('.testimonial-grid');
    let alignmentFrame;
    const alignTools = () => {
      cancelAnimationFrame(alignmentFrame);
      alignmentFrame = requestAnimationFrame(() => {
        if (!tools.isConnected) return;
        const height = desktopLayout.matches
          ? Math.max(0, reviews.getBoundingClientRect().bottom - tools.getBoundingClientRect().top)
          : 0;
        tools.style.setProperty('--tools-aligned-height', `${Math.ceil(height)}px`);
      });
    };
    const observer = new ResizeObserver(alignTools);
    [primaryColumn, secondaryColumn, reviews].forEach(element => observer.observe(element));
    desktopLayout.addEventListener('change', alignTools);
    document.querySelector('#app').addEventListener('learnlytics:view-enter', alignTools);
    alignTools();
  }

  // Temporary hosted Payment Page links are native anchors in each product template.
}
