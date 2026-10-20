// Existing external links can open the matching view without adding product routes.
// These fragments are consumed on arrival; normal navigation keeps the same URL.
const views = Object.freeze({
  '#kit-analyst': 'analyst',
  '#kit-scientist': 'scientist',
  '#kit-engineer': 'engineer',
  '#kit-complete': 'complete',
  '#legacy-resources': 'resources',
  '#legacy-reviews': 'reviews',
  '#legacy-about': 'about',
});
export const legacyEntryView = hash => Object.hasOwn(views, hash) ? views[hash] : null;
