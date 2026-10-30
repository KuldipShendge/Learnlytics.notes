import { setupDialog } from './dialog.js';
import { careerResources, resourceEndpoint } from './career-resources-data.js?v=toolkit-ml-kit-links-20261030';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export function setupCareerResources() {
  const section = document.querySelector('#career-resources');
  const grid = section.querySelector('.resource-grid');
  const dialog = document.querySelector('#resource-dialog');
  const modal = setupDialog(dialog);
  const form = dialog.querySelector('form');
  const submit = form.querySelector('[type="submit"]');
  const error = dialog.querySelector('#resource-error');
  const success = dialog.querySelector('#resource-success');
  const nameInput = form.elements.namedItem('name');
  const phoneInput = form.elements.namedItem('phone');
  let selected;
  let controller;
  let generation = 0;

  grid.innerHTML = careerResources.map((resource, index) => `
    <article class="resource-card" aria-labelledby="resource-${resource.id}-title">
      <div class="resource-cover"><img src="assets/images/career-resources/${resource.image}" alt="${escapeHtml(resource.title)} handbook cover" width="${resource.width}" height="${resource.height}" loading="${index === 0 ? 'eager' : 'lazy'}" /></div>
      <div class="resource-copy">
        <div class="resource-card-meta"><span class="free-tag">${resource.badge || 'Free'}</span><span>${resource.href ? escapeHtml(resource.category) : 'PDF handbook'}</span></div>
        <h2 id="resource-${resource.id}-title">${escapeHtml(resource.title)}</h2>
        <p>${escapeHtml(resource.description)}</p>
        ${resource.href
          ? `<a class="button" href="${resource.href}" data-view="${resource.view}">Explore Toolkit <svg class="icon" aria-hidden="true"><use href="assets/icons/product.svg#arrow" /></svg></a>`
          : `<button class="button" type="button" data-resource="${resource.id}" aria-label="Get ${escapeHtml(resource.title)} for free">Get free resource <svg class="icon" aria-hidden="true"><use href="assets/icons/product.svg#arrow" /></svg></button>`}
      </div>
    </article>`).join('');

  function cancelPending() {
    generation++;
    controller?.abort();
    controller = undefined;
    form.removeAttribute('aria-busy');
    submit.disabled = false;
    submit.textContent = 'Get my free resource';
  }
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-resource]');
    if (!button) return;
    selected = careerResources.find(resource => resource.id === button.dataset.resource);
    cancelPending();
    form.reset();
    nameInput.setCustomValidity('');
    phoneInput.setCustomValidity('');
    form.hidden = false;
    error.hidden = true;
    success.hidden = true;
    dialog.querySelector('#resource-dialog-title').textContent = selected.title;
    modal.open();
    nameInput.focus({ preventScroll: true });
  });
  for (const input of [nameInput, phoneInput]) input.addEventListener('input', () => input.setCustomValidity(''));
  dialog.addEventListener('close', cancelPending);
  document.querySelector('#app').addEventListener('learnlytics:view-leave', () => {
    if (section.isConnected) cancelPending();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || !selected) return;
    const name = nameInput.value.trim();
    const email = form.elements.namedItem('email').value.trim();
    const phone = phoneInput.value.trim();
    nameInput.setCustomValidity(name ? '' : 'Please enter your name.');
    const digits = phone.replace(/\D/g, '');
    phoneInput.setCustomValidity(/^[+\d\s().-]+$/.test(phone) && digits.length >= 10 && digits.length <= 15
      ? '' : 'Enter a valid phone number with country code (10–15 digits).');
    if (!form.reportValidity()) return;

    const request = ++generation;
    const resource = selected;
    const requestController = new AbortController();
    controller = requestController;
    const timeout = setTimeout(() => requestController.abort(), 20000);
    submit.disabled = true;
    submit.textContent = 'Preparing your resource…';
    form.setAttribute('aria-busy', 'true');
    error.hidden = true;
    // All selections receive the same email; resourceId only identifies the chosen card.
    const body = new URLSearchParams({ name, email, phone,
      resourceId: resource.id });
    try {
      const response = await fetch(resourceEndpoint, { method: 'POST', body, signal: requestController.signal });
      const text = await response.text();
      if (!response.ok || response.type === 'opaque' || /^\s*</.test(text)) throw new Error('Unconfirmed submission');
      let result;
      try { result = JSON.parse(text); } catch { /* The legacy endpoint may return plain text. */ }
      if (result?.success === false || result?.emailSent === false || result?.error ||
          /^(error|failed|failure)$/i.test(String(result?.status || result?.result || '')) ||
          (!result && /\b(error|failed|failure|exception)\b/i.test(text))) throw new Error('Submission failed');
      if (request !== generation || !dialog.open || !section.isConnected) return;
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
    } catch {
      if (request !== generation || !dialog.open) return;
      error.textContent = 'We couldn’t confirm your request. Your details are still here—please try again, or contact us below.';
      error.hidden = false;
      error.focus({ preventScroll: true });
    } finally {
      clearTimeout(timeout);
      if (request === generation) {
        controller = undefined;
        form.removeAttribute('aria-busy');
        submit.disabled = false;
        submit.textContent = 'Get my free resource';
      }
    }
  });
}
