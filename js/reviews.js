import { reviews } from './reviews-data.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

export function setupReviewReturn() {
  let source = 'home';
  document.addEventListener('click', event => {
    if (event.target.closest('.testimonial-read-more')) source = history.state?.learnlytics?.view || 'home';
  }, true);
  document.querySelector('#app').addEventListener('learnlytics:view-enter', () => {
    const back = document.querySelector('#reviews-back');
    if (!back) return;
    back.dataset.view = source;
    back.href = source === 'home' ? '#career-goal' : '#testimonials';
    back.textContent = source === 'home' ? '← Explore learning kits' : '← Back to your kit';
  });
}

export function setupReviewsPage() {
  document.querySelector('#all-reviews').innerHTML = reviews.map(review => `
    <article class="learner-review">
      <span class="review-category">${escapeHtml(review.category)}</span>
      <span class="review-stars" aria-label="${review.stars} out of 5 stars"><span aria-hidden="true">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</span></span>
      <blockquote>${escapeHtml(review.quote)}</blockquote>
      <div class="review-person"><span class="review-initial" aria-hidden="true">${escapeHtml(review.name[0])}</span><strong>${escapeHtml(review.name)}</strong></div>
    </article>`).join('');
}
