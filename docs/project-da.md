# Project Explanation Toolkit — DA and DS

Routes: `/project-da` (Data Analyst) and `/project-ds` (Data Science).
Both use the same layout, two parts, ten project titles and sixteen chapter titles.
Each reuses its existing product theme and cover:
`assets/images/da-toolkit-theme-20261019.webp` and
`assets/images/ds-toolkit-theme-20261019.webp`.

## Availability

Prices, strikethroughs and the Diwali campaign have been removed from both pages.
DA displays **Coming soon on 4 Nov**; DS displays **Coming soon on 12 Nov** (2026).
These dates are announcements. Purchases remain disabled and do not automatically
activate on the launch day. No payment infrastructure has been changed.

Shared configuration lives in `js/project-da-config.js`, keyed by `analyst` and
`scientist`. Each edition has its own `freePdfUrl` and `launchDate`.
Both PDF URLs remain empty because the actual files have not been supplied.
Only configure a real direct public PDF URL; all three download links on an edition
use that edition's configured URL. No checkout is involved in the free download.
For a local PDF, add the exact file to the preview and public-build PDF allowlists
and `deployment/public-files.json`. Cross-origin servers control download behavior.

## Integration and files

`index.html` contains both page templates. `js/project-da.js` and
`css/project-da.css` are shared by both editions. `js/main.js`, `js/site-routes.js`,
`vercel.json` and `sitemap.xml` register the routes. The existing DA and DS Toolkit
cards in `js/learning-experience.js` link to their respective pages. Career Resources
uses the existing card renderer and now includes both editions after the five
original handbooks (`js/career-resources-data.js`, `js/career-resources.js`).

## Local verification

Run `node scripts/preview.mjs`, then open either Toolkit route.
`node --test tests/project-da.test.mjs` checks the launch labels, removal of pricing
and identical parts/projects/chapters. `node tests/project-da-browser.cjs` checks both
routes at five widths, navigation/refresh, keyboard accordions, metadata, overflow,
launch notices and the product/resource entry links. Set `PREVIEW_URL` to the local
server and make Playwright available. `node tests/career-resources.cjs` tests all five
existing delivery forms with external requests intercepted.
`node scripts/build-public.mjs` builds locally without deploying.
