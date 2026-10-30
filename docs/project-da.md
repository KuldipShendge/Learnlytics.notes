# Data Analyst Project Explanation Toolkit

Local route: `/project-da`. Uses the shared Data Analyst product layout, navigation,
theme tokens and `assets/images/da-toolkit-theme-20261019.webp` (also used in the
existing DA Toolkit section and the new Career Resources card).

## Required configuration

Edit `js/project-da-config.js`:

- `freePdfUrl`: the actual public Part 01 PDF URL. Currently empty: no matching PDF
  was supplied. All three download links share this value and require no checkout.
  Prefer a direct same-origin PDF with download headers; cross-origin servers control
  whether the browser downloads or opens the PDF. If adding a local PDF, explicitly
  add that exact file to `scripts/preview.mjs` samplePaths,
  `scripts/build-public.mjs` samples and `deployment/public-files.json`.
- `checkout.offer.url`: an existing hosted payment link verified to charge ₹199 INR.
- `checkout.regular.url`: an existing hosted payment link verified to charge ₹499 INR.
  Both are currently empty. Confirm the product and fixed charge in the existing
  purchase service before filling these values, and set the corresponding `amount`.
  Frontend amount declarations cannot verify or change a hosted checkout's charge.
  The full DA Kit payment link must not be reused for this standalone resource.
- `offerStart` and exclusive `offerEnd`: timezone-qualified timestamps. Defaults cover
  October 30 through November 8, 2026 inclusive, IST (10 calendar days).

The page only selects a payment link whose configured amount matches the displayed
price. A missing or mismatched destination stays unavailable. At expiry the page
switches to ₹499 and the regular-price destination, never the ₹199 link. It refreshes
at the date boundary, on visibility/focus, view re-entry and purchase clicks.
Client time determines presentation; the existing payment provider remains
authoritative for charges. No payment backend, authentication or delivery code changed.

## Local verification

Run `node scripts/preview.mjs`, then visit `/project-da`, `/data-analyst` and
`/Career-Resources`. Run `node --test tests/project-da.test.mjs` for campaign boundary
and destination checks. `node scripts/build-public.mjs` builds locally without deploying.

Browser acceptance: `node tests/project-da-browser.cjs` with Playwright available
and `PREVIEW_URL` pointing to the preview. Checks 320, 390, 768, 1024 and 1440px,
direct loads/refresh, metadata, overflow, keyboard accordions, live offer expiry,
mobile navigation and both entry links. Screenshots go to ignored `screenshots/`.
`node tests/career-resources.cjs` checks the five existing delivery forms with all
external submissions intercepted.

## Changed files

Created: `css/project-da.css`, `js/project-da.js`, `js/project-da-config.js`,
`tests/project-da.test.mjs`, `tests/project-da-browser.cjs`, and this document.

Modified: `index.html` (page template and resource count), `js/main.js` and
`js/site-routes.js` (initialization/routing), `js/learning-experience.js` (existing DA
card link), `js/product.js` (updated module cache key), `js/career-resources-data.js`
and `js/career-resources.js` (new card in the same renderer),
`deployment/public-files.json`, `vercel.json`, `sitemap.xml` (local asset/route
registration), and `tests/career-resources.cjs` (six cards, five delivery forms,
current route assertions).
