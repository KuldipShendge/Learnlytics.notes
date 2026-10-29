# Typography experiment review — 2026-10-29

The six requested marketing pages now use Barlow Condensed for headings. The experiment is enabled through `class="font-experiment"` on `<html>`. The original CSS is intact. The later request, “Complete Last Update also on git”, authorizes committing and pushing this update; the restore point remains available.

## Files changed

- `index.html`: root class, isolated stylesheet link and ExtraBold font preload.
- `css/typography-experiment.css`: three local font faces and scoped heading-family/weight overrides.
- `assets/fonts/barlow-condensed/BarlowCondensed-SemiBold.ttf`: weight 600.
- `assets/fonts/barlow-condensed/BarlowCondensed-Bold.ttf`: weight 700.
- `assets/fonts/barlow-condensed/BarlowCondensed-ExtraBold.ttf`: weight 800.
- `assets/fonts/barlow-condensed/OFL.txt`: upstream font license.
- `deployment/public-files.json`: five public asset entries for the three fonts, license and stylesheet, so the existing build includes the new assets.
- `LEARNLYTICS_TYPOGRAPHY_RESTORE_POINT.md`: original typography reference and rollback instruction.
- `docs/typography-experiment-review.md`: this report.

Local QA scripts, JSON measurements and before/after screenshots remain in the already ignored `screenshots/` directory. They are not published as website assets. No hosting configuration or deployment workflow was changed, and no manual deployment was run.

## Font families and affected components

Original: `Manrope, 'Segoe UI', sans-serif`, defined through `--font` in `css/tokens.css`; local weights 400, 500, 600, 700 and 800. No secondary typeface was added to body content.

Updated headings: `'Barlow Condensed', Manrope, 'Arial Narrow', sans-serif`. Only 600, 700 and 800 are loaded, all with `font-display: swap`. Font files and the license come from the [official Google Fonts Barlow Condensed source](https://github.com/google/fonts/tree/main/ofl/barlowcondensed). The reference website informed the typography direction only; no layout or branding was copied.

- Hero H1: 800 on all six pages.
- Section H2: 700, including video guides, career selector, Learning Hub introduction, Toolkit introduction, resource categories, curriculum, samples, reviews and closing banners.
- Card/product H3/H4: 600, including kit recommendations, journey steps, Toolkit parts and editions, feature cards and combined-kit bonus headings. Career Resources cards use H2 and therefore receive 700.
- Curriculum module/part/unit titles and FAQ summaries: 600.
- Resource-form and sample-reader dialog headings: 700 for H2 and 600 for H3.

The small dashboard and Project Story example UI headings retain Manrope. Body copy, descriptions, navigation, buttons, forms, price/currency text, module metadata/count badges and footer text retain their original fonts. The footer contains links and paragraphs, rather than a separate heading; the closing banner above it receives the heading font. About, standalone Reviews, Learning Hub application and checkout-dialog typography are outside the experiment's scope.

## Original versus updated sizes

All sizes, line heights, tracking, capitalization and intentional line breaks are unchanged. Values below are computed at 360 / 768 / 1440px respectively; the original responsive rules also continue to apply at 390 and 1024px.

| Major heading type | Original size (px) | Updated size (px) | Weight before → after |
|---|---|---|---|
| Homepage H1 | 30 / 35.328 / 48 | 30 / 35.328 / 48 | 600 → 800 |
| Career Resources H1 | 30 / 30 / 40 | 30 / 30 / 40 | 600 → 800 |
| Four product-page H1s | 23 / 32 / 42 | 23 / 32 / 42 | 600 → 800 |
| Homepage standard H2 | 23 / 23 / 30 | 23 / 23 / 30 | 600 → 700 |
| Homepage video-guide headings | 25 / 25 / 28 | 25 / 25 / 28 | 600 → 700 |
| How It Works heading | 24 / 24 / 32 | 24 / 24 / 32 | 800 → 700 |
| Journey-step H3 | 14 / 15 / 15 | 14 / 15 / 15 | 800 → 600 |
| Homepage recommended kit H3 | 28 / 29 / 34 | 28 / 29 / 34 | 600 → 600 |
| Homepage resource-card H3 | 17 / 16 / 19 | 17 / 16 / 19 | 600 → 600 |
| Homepage Learning Hub H2 | 25 / 25 / 32 | 25 / 25 / 32 | 600 → 700 |
| Homepage Toolkit H2 | 24 / 24 / 29 | 24 / 24 / 29 | 600 → 700 |
| Toolkit part H3 / edition H4 | 17 / 17 / 17; 14 / 14 / 14 | Same | 600 → 600 |
| Homepage FAQ H2 | 23 / 23 / 35 | 23 / 23 / 35 | 600 → 700 |
| Resource library / closing H2 | 24 / 24 / 24 | Same | 600 → 700 |
| Career Resources card H2 | 17 / 17 / 17 | Same | 600 → 700 |
| Product section / samples H2 | 21 / 21 / 25 | Same | 600 → 700 |
| Product curriculum H2 | 25 / 25 / 25 | Same | 600 → 700 |
| Curriculum module / unit / part title | 14 / 14 / 14 | Same | 600 → 600 |
| Product feature-card H3 | 16 / 16 / 16 | Same | 600 → 600 |
| Product included-resource labels H3 | 10 / 14 / 13 | Same | 600 → 600 |
| Product Learning Hub / Toolkit H2 | 25 / 25 / 23; 24 / 24 / 23 | Same | 600 → 700 |
| Product benefit / audience H2 | 24 / 24 / 28 | Same | 600 → 700 |
| Product reviews H2 | 23 / 23 / 29 | Same | 600 → 700 |
| Product support H2 | 21 / 21 / 27 | Same | 600 → 700 |

Hero line heights remain 1.2 on the homepage; product heroes retain 1.3 on small screens and 1.2 on desktop. Standard section line heights remain 1.22 or the existing component-specific 1.25–1.35. Curriculum titles retain 1.5. The restore-point document records original computed line heights and source fingerprints.

## Responsive and interaction results

| Page | 1440 | 1024 | 768 | 390 | 360 | Original-font restore |
|---|---|---|---|---|---|---|
| Homepage | Pass | Pass | Pass | Pass | Pass | Exact match at all five widths |
| Career Resources | Pass | Pass | Pass | Pass | Pass | Exact match at all five widths |
| Data Analyst | Pass | Pass | Pass | Pass | Pass | Exact match at all five widths |
| Data Scientist & Gen AI | Pass | Pass | Pass | Pass | Pass | Exact match at all five widths |
| Machine Learning Engineer | Pass | Pass | Pass | Pass | Pass | Exact match at all five widths |
| All-in-One Combo | Pass | Pass | Pass | Pass | Pass | Exact match at all five widths |

The 30 cases found no horizontal overflow or clipped headings. Text content and protected body/control typography match the before snapshots. Expanded curriculum was additionally checked at 360 and 1440px on all four product pages, including heading/button overlap checks. Navigation toggles, four career choices, FAQs, resource-dialog open/close, all three sample types, PDF next-page and sample-reader open/close passed. Existing navigation regression checks passed for page URLs, Back/Forward, refresh, repeat visits and assets.

Chrome's rendered-font inspection confirmed real Barlow Condensed ExtraBold for all six heroes, SemiBold for curriculum titles, and Manrope for body text and the four product prices including `₹`. These are local font files, not synthesized or unexpected fallback fonts. Screenshots include the long technical titles and punctuation. No browser errors or missing assets were recorded in the 30-case audit. The public build passed with 306 allowlisted output files.

Before/after hero screenshots exist for every viewport; full-page comparisons exist at 390 and 1440px. Local paths: `screenshots/typography-experiment/before/` and `screenshots/typography-experiment/after/`. Measurement reports: `after-report.json`, `final-qa-report.json` and `swap-qa-report.json` in the same parent directory.

## Observations and limits

The condensed font often uses fewer lines. As a consequence, some content-sized cards and sections become shorter and downstream buttons move with the content. For example, a two-line curriculum summary can become one line, reducing its height by 21px. Existing automatic margins and the existing product-sidebar height-alignment script also recompute from that content. No width, height, margin, padding, grid or positioning declaration was added or changed. Enabled screenshots are therefore not pixel-identical in geometry to the original. Forcing identical heights would require layout overrides, which this experiment avoids.

The small included-resource labels retain their existing 10px mobile size; they are compact captions, and no global size increase was forced. Miniature dashboard and Project Story headings deliberately keep Manrope for clarity.

An isolated delayed Barlow swap, after existing fonts and initial assets settled, produced measured layout-shift sums of 0.002–0.065 across the six pages at 390 and 1440px (largest: Data Analyst mobile, 0.0653). A separate cold-load test delaying every font by 300ms exposed substantial existing homepage startup movement: approximately 0.803 with original typography versus 0.836 with the experiment on mobile. These are local diagnostic measurements, not field Core Web Vitals. The existing homepage startup behavior was left unchanged because fixing it would exceed the font-only scope.

## One-step rollback and preservation

In `index.html`, remove **only** `class="font-experiment"` from the opening `<html>` tag, then reload. It becomes:

```html
<html lang="en" data-theme="blue">
```

This was tested at all 30 combinations: font families, sizes, weights, line heights, tracking, heading dimensions/wrapping and measured container dimensions exactly matched the original snapshots. The class was re-enabled afterward and remains enabled for review. Keep `LEARNLYTICS_TYPOGRAPHY_RESTORE_POINT.md` until explicitly approved for removal.

Colors, backgrounds, images, icons, written content, original style rules, navigation code, checkout/Razorpay, tracking, payment/delivery, authentication, Learning Hub functionality and database code were not modified. Pre-existing unrelated local PDF/logo changes were left untouched and excluded from this update.
