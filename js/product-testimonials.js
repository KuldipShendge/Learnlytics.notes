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

  const mobile = matchMedia('(max-width: 559px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const controls = document.createElement('div');
  controls.className = 'testimonial-controls';
  controls.innerHTML = `<div class="testimonial-dots">${reviews.map((_, index) => `<button type="button" aria-label="Show review ${index + 1}" aria-current="${index === 0}"></button>`).join('')}</div><button type="button" class="testimonial-autoplay">Pause slides</button>`;
  track.after(controls);
  const dots = [...controls.querySelectorAll('.testimonial-dots button')];
  const pause = controls.querySelector('.testimonial-autoplay');
  const cards = [...track.children];
  let active = 0;
  let timer;
  let visible = false;
  let interacting = false;
  let focusPaused = false;
  let paused = reducedMotion.matches;
  const stop = () => clearTimeout(timer);
  const go = index => {
    const offset = cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left: offset, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  function schedule() {
    stop();
    pause.textContent = paused ? 'Play slides' : 'Pause slides';
    if (!mobile.matches || !visible || paused || interacting || focusPaused || !track.isConnected || document.hidden) return;
    timer = setTimeout(() => go((active + 1) % cards.length), 4500);
  }
  track.addEventListener('scroll', () => {
    active = cards.reduce((best, card, index) => Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left) < Math.abs(cards[best].getBoundingClientRect().left - track.getBoundingClientRect().left) ? index : best, 0);
    dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === active)));
    schedule();
  }, { passive: true });
  dots.forEach((dot, index) => dot.addEventListener('click', () => go(index)));
  pause.addEventListener('click', () => { paused = !paused; focusPaused = false; schedule(); });
  track.addEventListener('pointerdown', () => { interacting = true; stop(); });
  const release = () => { interacting = false; schedule(); };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  track.parentElement.addEventListener('focusin', () => { focusPaused = true; stop(); });
  track.parentElement.addEventListener('focusout', () => setTimeout(() => {
    focusPaused = track.parentElement.contains(document.activeElement);
    schedule();
  }, 0));
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, { threshold: .25 }).observe(track);
  mobile.addEventListener('change', () => { track.scrollLeft = 0; schedule(); });
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  document.querySelector('#app').addEventListener('learnlytics:view-leave', stop);
  document.querySelector('#app').addEventListener('learnlytics:view-enter', schedule);
  schedule();
}
