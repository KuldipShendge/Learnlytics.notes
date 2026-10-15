# LearnLytics — Single-URL Site

A new standalone homepage inspired by the supplied mobile mockup, built with LearnLytics’ current plum, magenta and blush palette. The default recommendation is **Crack Data Scientist & Gen AI**.

The Data Scientist & Gen AI product page uses the second reference for **structure and content only**. It shares the homepage's **plum, magenta and blush palette and Manrope font**, all defined in `css/tokens.css`. Both the featured “View kit details” link and the Data Scientist comparison card open the full product view inside `index.html`, without changing the browser URL. Separate page URLs are deferred to v2. See `docs/product-page.md` for implementation and curriculum notes.

The **About Us** view in `index.html` preserves the complete About section structure and copy from `D:\website\index.html`. Only its relevant responsive styles were extracted from `css/light-theme.css`; the old dashboard scripts and hidden-section behavior are not needed. Its links open the current learning kits and actual sample pages. All pages share a compact header with 14px navigation text and the original logo without the separately added tagline.

## Run locally

From `D:\GitHub Repos\Learnlytics.notes`, run:

```powershell
node scripts/preview.mjs
```

Open **http://127.0.0.1:4173**. Stop with Ctrl+C. Set `PORT` to use another port. No install or build step is required. Use an HTTP server rather than opening the HTML via `file://`, because JavaScript uses ES modules.

## Structure

| File | Responsibility |
| --- | --- |
| `index.html` | Homepage and embedded templates for the DS and About Us views; dialog shells and inline SVG icons |
| `css/about.css` | Selectively adapted About Us styles using the shared brand tokens |
| `css/tokens.css` | Brand tokens, local fonts, base styles and reusable UI primitives |
| `css/home.css` | Homepage components and mobile, tablet and desktop layouts |
| `css/navigation.css` | Shared header, logo treatment and navigation layout |
| `css/dialogs.css` | Shared modal, kit overview and guide player layouts |
| `js/catalog.js` | Presentation-only kit names, prices, subjects, images and content |
| `js/kits.js` | Career selection, comparison-card navigation and kit overview dialog |
| `js/dialog.js` | Shared dialog dismissal and focus restoration |
| `js/video-config.js` | Published guide titles and YouTube IDs, plus fallback demo chapters |
| `js/inline-videos.js` | Homepage and DS inline players, click-to-play controls and view-change cleanup |
| `js/main.js` | Mobile navigation and component initialization |
| `js/views.js` | In-page view switching, focus, titles, Back/Forward and refresh at the same URL |
| `css/product.css` | Product book illustration and responsive sections using shared brand tokens |
| `js/product.js` | Product curriculum rendering, shared guides and purchase placeholder |
| `js/ds-curriculum.js` | Seven original modules, 20 parts and per-part question/page counts |
| `js/sample-gallery.js` | Resource tabs, topic carousel, sample enlargement and workbook demo |
| `js/navigation.js` | Shared mobile navigation behavior |
| `assets/icons/product.svg` | Newly drawn SVG technology and product UI icons |
| `assets/images/samples/` | Six actual handbook and solution preview images from the old site |
| `assets/images/` | Ten selectively copied, existing WebP assets |
| `assets/fonts/` | Self-hosted Manrope fonts and SIL Open Font License |
| `scripts/preview.mjs` | Static preview server with optional project subfolder; no route rewrites or backend integrations |
| `tests/homepage.cjs` | Browser acceptance checks and screenshot capture |
| `tests/product.cjs` | Product interactions, curriculum totals, responsive checks and screenshots |
| `tests/navigation.cjs` | Unchanged URL, view switching, Back/Forward, refresh and repeated visits |
| `screenshots/` | Mobile, tablet and desktop captures plus verification results |

No framework, production dependencies, legacy scripts, duplicate theme overrides or inline event handlers are required. The homepage remains readable without JavaScript; switching views, kit selection and guide dialogs require it. Inactive views remain in templates, so only one main landmark and one set of dialog IDs are active.

## Existing branding and assets reused

Brand colors came from `D:\website\css\light-theme.css` and `homepage.css`: plum `#241525`, muted copy `#665866`, magenta `#b40982`, accent `#930b6b`, blush `#faf4f8` and borders `#e9e1e7`. The original logo is preserved with the monochrome CSS treatment already used by the existing site. Manrope matches the old site's typography and is served locally.

| New asset | Original under `D:\website\images` |
| --- | --- |
| `logo.webp` | `Logo.webp` |
| `favicon.webp` | `Favicon.webp` |
| `hero-learning.webp` | `light-theme/da-interview-kit-card-v2.webp` |
| `kit-data-science.webp` | `light-theme/ds-complete-hero-v2.webp` |
| `kit-data-analyst.webp` | `light-theme/da-complete-genai-slide-01-v3.webp` |
| `kit-machine-learning.webp` | `light-theme/ml-complete-kit-slide-01-v4.webp` |
| `kit-complete.webp` | `light-theme/combo-complete-slide-01-v2.webp` |
| `handbook.webp` | `light-theme/ds-handbooks-slide-v2.webp` |
| `workbook.webp` | `light-theme/ds-workbooks-slide-v2.webp` |
| `solutions.webp` | `light-theme/ds-solutions-slide-v2.webp` |

Product positioning, resource counts and displayed prices were transcribed selectively from the existing catalog and product content. Prices are presentation values, not a checkout source of truth; review them before a future commerce launch. The Combined kit covers Data Science + Gen AI + ML Engineering, as in the existing catalog. The materials section identifies its images as Data Scientist & Gen AI artwork and clarifies that the products are digital.

Only the About Us section and its relevant styles were copied from the old application. No old application controllers, payment code or dashboard dependencies were copied. No files in `D:\website` were modified.

## Newly created

- Responsive homepage with all requested sections.
- Four-way career selector, live recommendation updates, and lightweight kit overview dialogs on the homepage.
- Two branded homepage guide cards beside inline YouTube players, stacked on mobile.
- Click-to-play for both homepage guides, compact cards and direct YouTube links.
- Inline guide videos inside the existing Data Scientist cards, with autoplay off.
- Native FAQ accordions, keyboard navigation, dialog focus management, reduced-motion support and local font loading.
- No invented testimonials, learner totals, endorsements, urgency, ratings or job guarantees.

## Temporary content and future integration

Both supplied LearnLytics guides are configured in `js/video-config.js`:

- How to Use Your LearnLytics Interview Kit: https://youtu.be/gAV7onDGlNo
- Which Data & AI Interview Kit Is Right for You?: https://youtu.be/1hUTxkkk5jQ

The homepage shows both videos directly beside compact guide cards. Both players load lazily and wait for Play; autoplay is off on arrival and when returning to the homepage. Native YouTube controls provide pause, sound and fullscreen, with direct YouTube links below. Clicking a card's play icon or the hero guide button starts that inline video with sound and stops the other player. Leaving the homepage removes its players; returning recreates both players in their idle state.

The DS view embeds the same two guides directly inside its existing walkthrough and kit-selection cards. It reuses the homepage player setup: lazy loading, autoplay off, native YouTube controls, and cleanup on leaving the view. Returning to DS recreates both players in their idle state. The headings and comparison link remain beside the video cards.

All product images are existing LearnLytics assets; no unrelated stock images or image placeholders were introduced. The hero illustration is reused, while the two guide poster compositions are new.

The featured Data Scientist “View kit details” button opens the new product page; the other three kits still use homepage overviews. The product page's “Get This Kit Now” buttons open an honest availability dialog, with the Razorpay label under the primary button. **Checkout, Razorpay integration, Google Sheets, free downloads, secure delivery and accounts remain unimplemented.** No old payment or delivery files were copied or edited. Only the Data Scientist & Gen AI product page has been added.

The product page omits FAQs, file-format badges and refund claims as requested. It does not reproduce the reference's unverified ratings or testimonials. The two guide videos are the published LearnLytics walkthroughs. Handbook and solution previews are real existing assets; the workbook preview is a clearly labelled illustrative placeholder. WhatsApp links use the existing support contact, `+91 91306 31497`.

## Hosting and navigation

GitHub Pages serves `index.html` at the repository URL, such as `https://kuldipshendge.github.io/Learnlytics.notes/`. DS and About Us switch content in place; section links scroll without changing the URL. Browser Back/Forward switches views, and refresh restores the active view using browser history state. Opening the base URL in a new tab starts on the homepage. Separate shareable page URLs are deferred to v2.

All assets use relative paths, including generated sample images and SVG icons. No custom route rewrites or separate HTML entry points are required.

Changed assets use versioned URLs so returning visitors receive compatible HTML, scripts and styles. The entry point, product module and product styles use `ds-inline-guides-20261015`; unchanged modules retain their earlier versions. Bump the entry point, affected imports and styles when changing them again.

To test the same project-folder layout locally:

```powershell
$env:PREVIEW_BASE_PATH = '/Learnlytics.notes'
node scripts/preview.mjs
```

Open `http://127.0.0.1:4173/Learnlytics.notes/` and set `PREVIEW_URL` to that address when running the browser checks. The preview intentionally returns 404 for paths outside the configured project folder.

## Verification

The browser checks cover 360, 390, 430, 768, 1024 and 1440px widths, every career choice, recommendation content/prices, dialog layout, dismissal and focus, mobile navigation, comparison cards, inline guide placement, autoplay-off parameters, play buttons, YouTube embed IDs, player cleanup on view changes, FAQs, images and internal anchors. Browser acceptance tests stub the two expected YouTube embeds and block other nonlocal requests. They verify integration and cleanup; actual YouTube playback is checked separately.

The latest results are in `screenshots/verification.json` and `screenshots/product-verification.json`. Full-page screenshots are named `homepage-{width}.png` and `product-{width}.png`, with additional viewport images for 390 and 1440px. The DS purchase bar is hidden only while taking its full-page captures so it does not obscure the middle of the page; viewport screenshots show the actual fixed bar.

About Us was also checked at 360, 390, 430, 768, 900, 1024 and 1440px, including its header links, mobile menu, calls to action, content without JavaScript, and a comparison of its copy with the original section. Results are saved in `screenshots/about-verification.json`, with mobile and desktop captures in `about-390.png` and `about-1440.png`.

To rerun, start the preview server and run `node tests/homepage.cjs`, `node tests/product.cjs` and `node tests/navigation.cjs` in another terminal with Playwright available. `NODE_PATH` can point to the bundled Playwright installation. `BROWSER_PATH` overrides the default local Chrome executable; `PREVIEW_URL` overrides the server URL.

Verified in desktop Chromium with emulated viewport sizes; physical-device and Safari testing have not been performed.
