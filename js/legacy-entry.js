// Existing bookmarks still select the matching view, then resolve to its public URL.
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
