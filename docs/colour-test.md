# Reversible colour test

The blue experiment uses navy text, royal-blue actions, cool blue/lilac surfaces
and mint discount badges from the supplied reference. Layout, fonts, content,
images, videos and PDFs are unchanged.

All experiment rules are in `css/theme-blue.css`, scoped to
`html[data-theme="blue"]`. The original stylesheets remain untouched.

From `D:\GitHub Repos\Learnlytics.notes`:

```powershell
node scripts/set-theme.mjs plum
```

This restores the original colours. To try blue again:

```powershell
node scripts/set-theme.mjs blue
```

Refresh the local preview after switching. To change the live website, commit
and push `index.html`; GitHub Pages then deploys the selected palette.
No Git reset, file deletion or restoring the repository backup is necessary.

If npm is installed, `npm run theme:plum` and `npm run theme:blue` are equivalent shortcuts.

For a quick browser-only comparison, change the root `data-theme` attribute
between `blue` and `plum` in DevTools. This does not save or publish anything.
