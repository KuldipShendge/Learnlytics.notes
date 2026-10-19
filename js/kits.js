import { kits } from './catalog.js?v=ml-page-20261019';
import { setupDialog } from './dialog.js';

export function setupKits() {
  let selected = 'scientist';
  const dialog = document.querySelector('#kit-dialog');
  const modal = setupDialog(dialog);
  const content = document.querySelector('#kit-dialog-content');
  const field = (id) => document.getElementById(id);

  function selectKit(id) {
    const kit = kits[id];
    if (!kit) return;
    selected = id;
    document.querySelector(`input[name="career"][value="${id}"]`).checked = true;
    field('recommended-title').textContent = kit.title;
    field('kit-subtitle').textContent = kit.subtitle;
    field('kit-category').textContent = kit.category;
    field('kit-badge').textContent = kit.badge;
    field('kit-price').textContent = kit.price;
    field('kit-details').href = kit.view ? '#' : '#kit-dialog';
    if (kit.view) field('kit-details').dataset.view = kit.view;
    else delete field('kit-details').dataset.view;
    field('kit-image').src = `assets/images/${kit.image}`;
    field('kit-image').alt = `${kit.subtitle} cover`;
    field('kit-features').replaceChildren(
      ...kit.features.map((feature) => {
        const item = document.createElement('li');
        item.textContent = feature;
        return item;
      }),
    );
    field('selection-status').textContent = `Recommended kit updated: ${kit.subtitle}, ${kit.price}.`;
  }

  document.querySelectorAll('input[name="career"]').forEach((input) => {
    input.addEventListener('change', () => selectKit(input.value));
  });
  field('kit-details').addEventListener('click', (event) => {
    const kit = kits[selected];
    if (kit.view) return;
    event.preventDefault();
    // All content is local, editorial catalog data, never user-supplied HTML.
    content.innerHTML = `
      <div class="kit-detail-top">
        <img src="assets/images/${kit.image}" alt="${kit.subtitle} cover" width="1024" height="1536">
        <div><p class="eyebrow">${kit.category}</p><h2 id="kit-dialog-title">${kit.title}</h2><p>${kit.description}</p><span class="kit-detail-price">${kit.price}</span></div>
      </div>
      <div class="kit-detail-body"><h3>Your learning pathway</h3><ol class="topic-list">${kit.topics.map((topic) => `<li>${topic}</li>`).join('')}</ol>
        <button class="button" type="button" id="explore-materials">Explore the included materials <svg class="icon"><use href="#i-arrow"/></svg></button>
        <p class="kit-detail-note">Digital learning resources. Purchasing and downloads are not available on this homepage yet.</p>
      </div>`;
    content.querySelector('#explore-materials').addEventListener('click', () => {
      modal.close();
      // Wait for native dialog focus restoration before moving to the section.
      requestAnimationFrame(() => {
        const heading = field('inside-title');
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        field('inside').scrollIntoView({ block: 'start' });
      });
    });
    modal.open();
  });
}
