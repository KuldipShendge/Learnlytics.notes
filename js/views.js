// Keep every view at the existing site URL; static hosting needs no route rewrites.
export function setupViews(initializers) {
  const app = document.querySelector('#app');
  const description = document.querySelector('meta[name="description"]');
  const views = new Map([
    ['home', {
      content: document.createDocumentFragment(),
      bodyClass: document.body.className,
      title: document.title,
      description: description.content,
      initialized: true,
    }],
  ]);
  document.querySelectorAll('template[id^="view-"]').forEach((template) => {
    views.set(template.id.slice(5), {
      content: template.content,
      bodyClass: template.dataset.bodyClass,
      title: template.dataset.title,
      description: template.dataset.description,
    });
  });
  let current = 'home';
  initializers.home();

  function show(view, section = '', moveFocus = true) {
    if (!views.has(view)) return;
    if (view !== current) {
      app.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
      app.dispatchEvent(new Event('learnlytics:view-leave'));
      views.get(current).content.append(...app.childNodes);
      const next = views.get(view);
      app.append(next.content);
      current = view;
      document.body.className = next.bodyClass;
      document.title = next.title;
      description.content = next.description;
      if (!next.initialized) {
        initializers[view]?.();
        next.initialized = true;
      }
      app.dispatchEvent(new Event('learnlytics:view-enter'));
    }
    const target = section ? document.getElementById(section) : app.querySelector('h1');
    if (target && moveFocus) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
    if (section && target) target.scrollIntoView({ block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function save(view, section, push = false) {
    const state = { ...history.state, learnlytics: { view, section } };
    // Omitting the URL preserves both the project folder and the address bar.
    if (push) history.pushState(state, '');
    else history.replaceState(state, '');
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const view = link.dataset.view || current;
    const section = link.getAttribute('href').slice(1);
    if (!views.has(view)) return;
    event.preventDefault();
    save(view, section, view !== current);
    show(view, section);
  });

  window.addEventListener('popstate', (event) => {
    const state = event.state?.learnlytics;
    show(state?.view || 'home', state?.section || '');
  });

  const saved = history.state?.learnlytics;
  const view = views.has(saved?.view) ? saved.view : 'home';
  const section = saved?.section || location.hash.slice(1);
  save(view, section);
  if (view !== 'home' || section) show(view, section, false);
}
