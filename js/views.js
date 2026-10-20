import { legacyEntryView } from './legacy-entry.js';
import { pathView, viewUrl, viewPaths, siteOrigin } from './site-routes.js';

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

  function syncMetadata() {
    const canonical = `${siteOrigin}/${viewPaths[current]}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      document.querySelector(selector)?.setAttribute('content', document.title);
    }
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      document.querySelector(selector)?.setAttribute('content', description.content);
    }
  }

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
    syncMetadata();
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
    // Search parameters belong before the fragment (including campaign attribution).
    const target = new URL(viewUrl(view, section), location.origin);
    target.search = location.search;
    if (push) history.pushState(state, '', target.pathname + target.search + target.hash);
    else history.replaceState(state, '', target.pathname + target.search + target.hash);
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
        link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    const view = link.dataset.view || pathView(url.pathname);
    const section = url.hash.slice(1);
    if (!views.has(view)) return;
    event.preventDefault();
    save(view, section, view !== current || section !== location.hash.slice(1));
    show(view, section);
  });

  window.addEventListener('popstate', (event) => {
    show(pathView(location.pathname) || 'home', location.hash.slice(1));
  });
  window.addEventListener('hashchange', () => {
    const entry = legacyEntryView(location.hash);
    if (entry) {
      save(entry, '');
      show(entry, '');
    }
  });

  const entryView = legacyEntryView(location.hash);
  const view = entryView || pathView(location.pathname) || 'home';
  const section = entryView ? '' : location.hash.slice(1);
  save(view, section);
  if (view !== 'home' || section) show(view, section, false);
}
