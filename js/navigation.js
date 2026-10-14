export function setupNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-nav');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    navigation.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
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
    if (!event.target.closest('.header-inner')) setMenu(false);
  });
  matchMedia('(min-width: 900px)').addEventListener('change', () => setMenu(false));
}
