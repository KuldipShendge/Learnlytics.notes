const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export function setupProductTestimonials(reviews) {
  const track = document.querySelector('.product-testimonials .testimonial-grid');
  track.innerHTML = reviews.map((review, index) => `
    <article class="testimonial-card" data-channel="${review.channel}" aria-label="Review ${index + 1} of ${reviews.length}">
      <svg class="testimonial-channel testimonial-channel--${review.channel}" aria-hidden="true"><use href="assets/icons/reviews.svg#${review.channel}" /></svg>
      <blockquote>${escapeHtml(review.quote)}</blockquote>
      <div class="testimonial-person"><span class="testimonial-avatar" aria-hidden="true">${escapeHtml(review.initials)}</span><div><strong>${escapeHtml(review.name)}</strong><p>${escapeHtml(review.role)}</p></div></div>
    </article>`).join('');
}
