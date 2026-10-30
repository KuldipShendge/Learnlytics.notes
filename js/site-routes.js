export const siteOrigin = 'https://www.learnlyticshandbook.shop';
export const viewPaths = Object.freeze({
  home: '',
  analyst: 'data-analyst',
  project: 'project-da',
  'project-ds': 'project-ds',
  'project-ml': 'project-ml',
  scientist: 'data-scientist-gen-ai',
  engineer: 'machine-learning-engineer',
  complete: 'all-in-one-combo',
  resources: 'Career-Resources',
  about: 'about-us',
  reviews: 'learner-reviews',
});
export const hubPath = 'learnlytics-learning-hub';

// Resolve from this module so local previews and project-folder hosting share links.
export const siteBase = new URL('../', import.meta.url);
export function viewUrl(view, section = '') {
  if (!Object.hasOwn(viewPaths, view)) return null;
  const url = new URL(viewPaths[view], siteBase);
  url.hash = section;
  return url.pathname + url.hash;
}
export function pathView(pathname, basePath = siteBase.pathname) {
  if (!pathname.startsWith(basePath)) return null;
  const path = pathname.slice(basePath.length).replace(/\/$/, '');
  if (path === 'index.html') return 'home';
  return Object.entries(viewPaths).find(([, slug]) => slug === path)?.[0] || null;
}
