const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export function setupProductTestimonials(reviews) {
  const app = document.querySelector('#app');
  const section = app.querySelector('.product-testimonials');
  const track = section.querySelector('.testimonial-grid');
  const dots = section.querySelector('.testimonial-dots');
  const toggle = section.querySelector('.testimonial-autoplay');
  const mobile = matchMedia('(max-width: 559px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  track.innerHTML = reviews.map((review, index) => `
    <article class="testimonial-card" data-channel="${review.channel}" aria-label="Review ${index + 1} of ${reviews.length}">
      <svg class="testimonial-channel testimonial-channel--${review.channel}" aria-hidden="true"><use href="assets/icons/reviews.svg#${review.channel}" /></svg>
      <blockquote>${escapeHtml(review.quote)}</blockquote>
      <div class="testimonial-person"><span class="testimonial-avatar" aria-hidden="true">${escapeHtml(review.initials)}</span><div><strong>${escapeHtml(review.name)}</strong><p>${escapeHtml(review.role)}</p></div></div>
    </article>`).join('');
  dots.innerHTML = reviews.map((review, index) => `<button class="testimonial-dot" type="button" aria-label="Show review by ${escapeHtml(review.name)}" aria-current="${index === 0}" data-index="${index}"></button>`).join('');
  const cards = [...track.children];
  let timer, scrollTimer;
  let inView = false, touching = false, hovering = false, paused = false;

  function positions() {
    const max = track.scrollWidth - track.clientWidth;
    return cards.map(card => Math.min(card.offsetLeft - cards[0].offsetLeft, max));
  }
  function currentIndex() {
    const offsets = positions();
    return offsets.reduce((best, offset, index) => Math.abs(offset - track.scrollLeft) < Math.abs(offsets[best] - track.scrollLeft) ? index : best, 0);
  }
  function updateDots() {
    const current = currentIndex();
    [...dots.children].forEach((dot, index) => dot.setAttribute('aria-current', String(index === current)));
  }
  function schedule() {
    clearTimeout(timer);
    const canSlide = section.isConnected && mobile.matches && !reducedMotion.matches &&
      inView && !document.hidden && !paused && !touching && !hovering &&
      (!section.contains(document.activeElement) || document.activeElement === toggle);
    track.dataset.autoSliding = String(canSlide);
    if (canSlide) timer = setTimeout(() => {
      show((currentIndex() + 1) % cards.length);
      schedule();
    }, 4500);
  }
  function show(index) {
    track.scrollTo({ left: positions()[index], behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
    schedule();
  }, { threshold: [0, 0.25] });

  track.addEventListener('scroll', () => {
    updateDots();
    clearTimeout(timer);
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(schedule, 180);
  }, { passive: true });
  track.addEventListener('pointerdown', () => { touching = true; schedule(); });
  window.addEventListener('pointerup', () => { if (touching) { touching = false; schedule(); } });
  window.addEventListener('pointercancel', () => { touching = false; schedule(); });
  track.addEventListener('keydown', event => {
    if (!mobile.matches || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    show((currentIndex() + direction + cards.length) % cards.length);
  });
  dots.addEventListener('click', event => {
    const button = event.target.closest('[data-index]');
    if (button) show(Number(button.dataset.index));
  });
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? 'Resume slides' : 'Pause slides';
    toggle.setAttribute('aria-label', paused ? 'Resume automatic review slides' : 'Pause automatic review slides');
    schedule();
  });
  section.addEventListener('mouseenter', () => {
    // Touch devices can synthesize mouseenter after a tap; do not freeze their slides.
    hovering = matchMedia('(hover: hover)').matches;
    schedule();
  });
  section.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  section.addEventListener('focusin', schedule);
  section.addEventListener('focusout', () => queueMicrotask(schedule));
  document.addEventListener('visibilitychange', schedule);
  mobile.addEventListener('change', () => { updateDots(); schedule(); });
  reducedMotion.addEventListener('change', () => { toggle.hidden = reducedMotion.matches; schedule(); });
  app.addEventListener('learnlytics:view-leave', () => {
    if (!section.isConnected) return;
    observer.unobserve(section);
    inView = false;
    clearTimeout(scrollTimer);
    schedule();
  });
  function mount() {
    if (!section.isConnected) return;
    hovering = false;
    touching = false;
    toggle.hidden = reducedMotion.matches;
    observer.observe(section);
    updateDots();
  }
  app.addEventListener('learnlytics:view-enter', mount);
  mount();
}
