# LearnLytics V2 — Homepage, About Us and Data Scientist Product Page

A new standalone homepage inspired by the supplied mobile mockup, built with LearnLytics’ current plum, magenta and blush palette. The default recommendation is **Crack Data Scientist & Gen AI**.

The Data Scientist & Gen AI product page uses the second reference for **structure and content only**. It shares the homepage's **plum, magenta and blush palette and Manrope font**, all defined in `css/tokens.css`. Both the featured “View kit details” link and the Data Scientist comparison card open `/course-bundles/data-scientist-genai-engineer-bundle`. The direct `/data-scientist-genai.html` URL also works. See `docs/product-page.md` for implementation and curriculum notes.

The **About Us** page at `/about-us` preserves the complete About section structure and copy from `D:\website\index.html`. Only its relevant responsive styles were extracted from `css/light-theme.css`; the old dashboard scripts and hidden-section behavior are not needed. Its links open the current learning kits and actual sample pages. All pages share a compact header with 14px navigation text and the original logo without the separately added tagline.

## Run locally

From `D:\learnlytics_v2`, run:

```powershell
node scripts/preview.mjs
```

Open **http://127.0.0.1:4173**. Stop with Ctrl+C. Set `PORT` to use another port. No install or build step is required. Use an HTTP server rather than opening the HTML via `file://`, because JavaScript uses ES modules.

## Structure

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic homepage sections, default recommendation, shared dialog shells and inline SVG icons |
| `about.html` | Original About Us content, connected to the current homepage and samples |
| `css/about.css` | Selectively adapted About Us styles using the shared brand tokens |
| `js/about.js` | Initializes the shared mobile navigation on About Us |
| `css/tokens.css` | Brand tokens, local fonts, base styles and reusable UI primitives |
| `css/home.css` | Homepage components and mobile, tablet and desktop layouts |
| `css/navigation.css` | Shared header, logo treatment and navigation layout |
| `css/dialogs.css` | Shared modal, kit overview and guide demo layouts |
| `js/catalog.js` | Presentation-only kit names, prices, subjects, images and content |
| `js/kits.js` | Career selection, comparison-card navigation and kit overview dialog |
| `js/dialog.js` | Shared dialog dismissal and focus restoration |
| `js/video-config.js` | Guide titles, demo chapters and optional future YouTube IDs |
| `js/videos.js` | Click-to-open guides, local demo playback and future video embed support |
| `js/main.js` | Mobile navigation and component initialization |
| `data-scientist-genai.html` | New Data Scientist & Gen AI product page |
| `css/product.css` | Product book illustration and responsive sections using shared brand tokens |
| `js/product.js` | Product curriculum rendering, shared guides and purchase placeholder |
| `js/ds-curriculum.js` | Seven original modules, 20 parts and per-part question/page counts |
| `js/sample-gallery.js` | Resource tabs, topic carousel, sample enlargement and workbook demo |
| `js/navigation.js` | Shared mobile navigation behavior |
| `assets/icons/product.svg` | Newly drawn SVG technology and product UI icons |
| `assets/images/samples/` | Six actual handbook and solution preview images from the old site |
| `assets/images/` | Ten selectively copied, existing WebP assets |
| `assets/fonts/` | Self-hosted Manrope fonts and SIL Open Font License |
| `scripts/preview.mjs` | Small local static server and explicit page routes; no backend integrations |
| `tests/homepage.cjs` | Browser acceptance checks and screenshot capture |
| `tests/product.cjs` | Product interactions, curriculum totals, responsive checks and screenshots |
| `screenshots/` | Mobile, tablet and desktop captures plus verification results |

No framework, production dependencies, legacy scripts, duplicate theme overrides or inline event handlers are required. The page content remains readable without JavaScript; kit selection and guide dialogs require it.

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

- Responsive homepage with all requested sections and a mobile bottom CTA.
- Four-way career selector, live recommendation updates, and lightweight kit overview dialogs on the homepage.
- Two branded video posters made with HTML/CSS and a shared guide dialog.
- Three-step, playable local guide demos with previous, next, play and pause controls.
- Native FAQ accordions, keyboard navigation, dialog focus management, reduced-motion support and local font loading.
- No invented testimonials, learner totals, endorsements, urgency, ratings or job guarantees.

## Temporary content and future integration

Both guide videos are **explicitly labelled demos**. No real or final YouTube video is hardcoded. To replace a demo, set its `youtubeId` in `js/video-config.js` to the final 11-character ID. The video iframe is created only when the user opens the guide and is removed when the dialog closes.

All product images are existing LearnLytics assets; no unrelated stock images or image placeholders were introduced. The hero illustration is reused, while the two guide poster compositions are new.

The featured Data Scientist “View kit details” button opens the new product page; the other three kits still use homepage overviews. The product page's “Get This Kit Now” buttons open an honest availability dialog, with the Razorpay label under the primary button. **Checkout, Razorpay integration, Google Sheets, free downloads, secure delivery and accounts remain unimplemented.** No old payment or delivery files were copied or edited. Only the Data Scientist & Gen AI product page has been added.

The product page omits FAQs, file-format badges and refund claims as requested. It does not reproduce the reference's unverified ratings or testimonials. The two guide videos are demos. Handbook and solution previews are real existing assets; the workbook preview is a clearly labelled illustrative placeholder. WhatsApp links use the existing support contact, `+91 91306 31497`.

## Verification

The browser checks cover 360, 390, 430, 768, 1024 and 1440px widths, every career choice, recommendation content/prices, dialog layout, dismissal and focus, mobile navigation, comparison cards, the sticky CTA, both guide demos, demo playback, FAQs, images and internal anchors. All nonlocal network requests are blocked during testing.

The latest results are in `screenshots/verification.json` and `screenshots/product-verification.json`. Full-page screenshots are named `homepage-{width}.png` and `product-{width}.png`, with additional viewport images for 390 and 1440px. Fixed bottom CTA bars are hidden only while taking the full-page captures so they do not obscure the middle of the page; viewport screenshots show the actual fixed bar.

About Us was also checked at 360, 390, 430, 768, 900, 1024 and 1440px, including its header links, mobile menu, calls to action, content without JavaScript, and a comparison of its copy with the original section. Results are saved in `screenshots/about-verification.json`, with mobile and desktop captures in `about-390.png` and `about-1440.png`.

To rerun, start the preview server and run `node tests/homepage.cjs` and `node tests/product.cjs` in another terminal with Playwright available. `NODE_PATH` can point to the bundled Playwright installation. `BROWSER_PATH` overrides the default local Chrome executable; `PREVIEW_URL` overrides the server URL.

Verified in desktop Chromium with emulated viewport sizes; physical-device and Safari testing have not been performed.
