# Project Explanation Toolkit — DA, DS and ML

Routes: `/project-da` (Data Analyst), `/project-ds` (Data Science), and
`/project-ml` (Machine Learning).
All three use the same layout, two parts, ten project titles and sixteen chapter titles.
Each reuses its existing product theme and cover:
`assets/images/da-toolkit-theme-20261019.webp` and
`assets/images/ds-toolkit-theme-20261019.webp`, plus
`assets/images/ml-toolkit-theme-20261019.webp`.

## Availability

Prices, strikethroughs and the Diwali campaign have been removed from all three pages.
DA displays **Coming soon on 4 Nov**; DS displays **Coming soon on 12 Nov** (2026).
ML displays **Coming soon** without a date.
These dates are announcements. Purchases remain disabled and do not automatically
activate on the launch day. No payment infrastructure has been changed.

Shared configuration lives in `js/project-da-config.js`, keyed by `analyst`,
`scientist` and `engineer`. Each edition has its own `freePdfUrl` and `launchDate`.
All three PDF URLs remain empty because the actual files have not been supplied.
Only configure a real direct public PDF URL; all three download links on an edition
use that edition's configured URL. No checkout is involved in the free download.
For a local PDF, add the exact file to the preview and public-build PDF allowlists
and `deployment/public-files.json`. Cross-origin servers control download behavior.

## Integration and files

`index.html` contains all three page templates. `js/project-da.js` and
`css/project-da.css` are shared by all three editions. `js/main.js`, `js/site-routes.js`,
`vercel.json` and `sitemap.xml` register the routes. The existing DA, DS and ML Toolkit
cards in `js/learning-experience.js` link to their respective pages. Career Resources
uses the existing card renderer and now includes all three editions after the five
original handbooks (`js/career-resources-data.js`, `js/career-resources.js`).

Each hero includes a button-style “Free With Complete DA/DS/ML Kit — Explore here”
card directly above the edition label. It opens the matching `/data-analyst`,
`/data-scientist-gen-ai` or `/machine-learning-engineer` product page.

## Local verification

Run `node scripts/preview.mjs`, then open any Toolkit route.
`node --test tests/project-da.test.mjs` checks the launch labels, removal of pricing
and identical parts/projects/chapters. `node tests/project-da-browser.cjs` checks all three
routes at five widths, navigation/refresh, keyboard accordions, metadata, overflow,
launch notices and the product/resource entry links. Set `PREVIEW_URL` to the local
server and make Playwright available. `node tests/career-resources.cjs` tests all five
existing delivery forms with external requests intercepted.
`node scripts/build-public.mjs` builds locally without deploying.
