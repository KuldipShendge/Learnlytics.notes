export function setupNavigation() {
  function setMenu(open) {
    const toggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('#main-nav');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    navigation.classList.toggle('is-open', open);
  }
  document.addEventListener('keydown', (event) => {
    const toggle = document.querySelector('.menu-toggle');
    if (
      event.key === 'Escape' &&
      !document.querySelector('dialog[open]') &&
      toggle.getAttribute('aria-expanded') === 'true'
    ) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.menu-toggle');
    if (toggle) setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    else if (event.target.closest('#main-nav a') || !event.target.closest('.header-inner')) setMenu(false);
  });
  matchMedia('(min-width: 900px)').addEventListener('change', () => setMenu(false));
}
