import { projectDAConfig, projectDAOffer } from './project-da-config.js';

export function setupProjectDA() {
  const page = document.querySelector('[data-project-da]');
  const app = document.querySelector('#app');
  let timer;
  const money = value => `₹${value}`;

  function setLink(link, url) {
    if (url) {
      link.href = url;
      link.removeAttribute('aria-disabled');
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
    }
  }

  const pdf = projectDAConfig.freePdfUrl;
  const freeUrl = /^(https:\/\/|\/(?!\/)|\.?\.?\/|pdfs\/)/i.test(pdf) ? pdf : '';
  page.querySelectorAll('[data-project-download]').forEach(link => setLink(link, freeUrl));
  page.querySelectorAll('[data-download-status]').forEach(note => { note.hidden = Boolean(freeUrl); });

  function refresh() {
    clearTimeout(timer);
    if (!page.isConnected) return;
    const offer = projectDAOffer();
    page.querySelectorAll('[data-project-price]').forEach(el => { el.textContent = money(offer.price); });
    page.querySelectorAll('[data-project-regular]').forEach(el => { el.textContent = money(projectDAConfig.regularPrice); el.hidden = !offer.active; });
    page.querySelectorAll('[data-project-promo]').forEach(el => { el.hidden = !offer.active; });
    page.querySelectorAll('[data-project-buy]').forEach(link => {
      setLink(link, offer.checkoutUrl);
      link.textContent = link.dataset.projectBuy === 'final'
        ? `Get Part 02 for ${money(offer.price)}` : `Get Part 02 — ${money(offer.price)}`;
    });
    page.querySelectorAll('[data-purchase-status]').forEach(note => { note.hidden = Boolean(offer.checkoutUrl); });
    const format = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
    page.querySelector('[data-offer-dates]').textContent = offer.active
      ? `${format.format(new Date(projectDAConfig.offerStart))} – ${format.format(new Date(Date.parse(projectDAConfig.offerEnd) - 1))}, 11:59 PM IST`
      : '';
    const boundary = [Date.parse(projectDAConfig.offerStart), Date.parse(projectDAConfig.offerEnd)].find(time => time > Date.now());
    if (boundary) timer = setTimeout(refresh, Math.min(boundary - Date.now() + 20, 2147483647));
  }

  // Refresh on return from a suspended tab and immediately before opening checkout.
  page.addEventListener('click', event => {
    const link = event.target.closest('[data-project-buy], [data-project-download]');
    if (!link) return;
    if (link.hasAttribute('data-project-buy')) refresh();
    if (link.getAttribute('aria-disabled') === 'true') event.preventDefault();
  });
  page.addEventListener('auxclick', event => {
    if (event.target.closest('[data-project-buy]')) refresh();
  });
  app.addEventListener('learnlytics:view-enter', refresh);
  app.addEventListener('learnlytics:view-leave', () => clearTimeout(timer));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  window.addEventListener('focus', refresh);
  refresh();
}
