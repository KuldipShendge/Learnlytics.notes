# LEARNLYTICS_TYPOGRAPHY_RESTORE_POINT

Created 2026-10-29 before changing any original typography declaration. Initially prepared for local review; the user's subsequent request authorized committing and pushing the update to GitHub. Keep this file until explicit approval to remove the restore point and finalize the experiment.

## One-step rollback

In `index.html`, remove only `class="font-experiment"` from the opening `<html>` tag and reload. The original opening tag is `<html lang="en" data-theme="blue">`. No other files need editing. Re-add the class to re-enable the experiment. The original CSS remains intact.

## Original baseline

All six marketing pages use locally hosted Manrope, with `Segoe UI`, sans-serif fallbacks. Weights 400, 500, 600, 700 and 800 are defined in `css/tokens.css`. Existing files are not backed up or duplicated. Baseline source fingerprints and the original declarations below make this a small reference, not a full project backup.

Original declarations use `--font: Manrope, 'Segoe UI', sans-serif`; body text inherits this through `font-family: var(--font)`. Buttons and inputs use `font: inherit`. Default h1/h2/h3 weight is 600, line-height 1.22 and letter-spacing -0.4px.

## Representative computed originals

| Page / width | Component | Size | Weight | Line height | Letter spacing | Lines |
|---|---|---|---|---|---|---|
| home-360 | #hero-title | 30px | 600 | 36px | -0.6px | 2 |
| home-360 | #use-title | 25px | 600 | 31.25px | -0.4px | 2 |
| home-360 | #kit-journey-title | 24px | 800 | 30px | -0.8px | 2 |
| home-360 | #career-title | 23px | 600 | 28.06px | -0.4px | 1 |
| home-360 | #recommended-title | 28px | 600 | 36.4px | -0.4px | 2 |
| home-360 | h3 in resource-copy | 17px | 600 | 20.74px | -0.4px | 2 |
| home-360 | #learning-toolkit-title | 24px | 600 | 30.72px | -0.65px | 2 |
| home-390 | #hero-title | 30px | 600 | 36px | -0.6px | 2 |
| home-390 | #use-title | 25px | 600 | 31.25px | -0.4px | 2 |
| home-390 | #kit-journey-title | 24px | 800 | 30px | -0.8px | 2 |
| home-390 | #career-title | 23px | 600 | 28.06px | -0.4px | 1 |
| home-390 | #recommended-title | 28px | 600 | 36.4px | -0.4px | 2 |
| home-390 | h3 in resource-copy | 17px | 600 | 20.74px | -0.4px | 1 |
| home-390 | #learning-toolkit-title | 24px | 600 | 30.72px | -0.65px | 1 |
| home-768 | #hero-title | 35.328px | 600 | 42.3936px | -0.6px | 2 |
| home-768 | #use-title | 25px | 600 | 31.25px | -0.4px | 2 |
| home-768 | #kit-journey-title | 24px | 800 | 30px | -0.8px | 1 |
| home-768 | #career-title | 23px | 600 | 28.06px | -0.4px | 1 |
| home-768 | #recommended-title | 29px | 600 | 37.7px | -0.4px | 2 |
| home-768 | h3 in resource-copy | 16px | 600 | 19.52px | -0.4px | 2 |
| home-768 | #learning-toolkit-title | 24px | 600 | 30.72px | -0.65px | 1 |
| home-1024 | #hero-title | 48px | 600 | 57.6px | -0.6px | 2 |
| home-1024 | #use-title | 28px | 600 | 35px | -0.4px | 2 |
| home-1024 | #kit-journey-title | 25.6px | 800 | 32px | -0.8px | 1 |
| home-1024 | #career-title | 25.6px | 600 | 31.232px | -0.4px | 1 |
| home-1024 | #recommended-title | 34px | 600 | 44.2px | -0.4px | 2 |
| home-1024 | h3 in resource-copy | 19px | 600 | 23.18px | -0.4px | 1 |
| home-1024 | #learning-toolkit-title | 29px | 600 | 37.12px | -0.65px | 1 |
| home-1440 | #hero-title | 48px | 600 | 57.6px | -0.6px | 2 |
| home-1440 | #use-title | 28px | 600 | 35px | -0.4px | 2 |
| home-1440 | #kit-journey-title | 32px | 800 | 40px | -0.8px | 1 |
| home-1440 | #career-title | 30px | 600 | 36.6px | -0.4px | 1 |
| home-1440 | #recommended-title | 34px | 600 | 44.2px | -0.4px | 2 |
| home-1440 | h3 in resource-copy | 19px | 600 | 23.18px | -0.4px | 1 |
| home-1440 | #learning-toolkit-title | 29px | 600 | 37.12px | -0.65px | 1 |
| resources-360 | #career-resources-title | 30px | 600 | 36px | -0.6px | 1 |
| resources-1440 | #career-resources-title | 40px | 600 | 48px | -0.6px | 1 |
| analyst-360 | #product-title | 23px | 600 | 29.9px | -0.6px | 3 |
| analyst-360 | #kit-journey-title | 24px | 800 | 30px | -0.8px | 2 |
| analyst-360 | #included-title | 21px | 600 | 28.35px | -0.25px | 1 |
| analyst-360 | #curriculum-title | 25px | 600 | 33.75px | -0.25px | 2 |
| analyst-360 | strong in module-heading | 14px | 600 | 21px | -0.2px | 1 |
| analyst-360 | #learning-toolkit-title | 24px | 600 | 30.72px | -0.65px | 2 |
| analyst-360 | #samples-title | 21px | 600 | 28.35px | -0.25px | 1 |
| analyst-768 | #product-title | 32px | 600 | 41.6px | -0.6px | 2 |
| analyst-768 | #kit-journey-title | 24px | 800 | 30px | -0.8px | 1 |
| analyst-768 | #included-title | 21px | 600 | 28.35px | -0.25px | 1 |
| analyst-768 | #curriculum-title | 25px | 600 | 33.75px | -0.25px | 2 |
| analyst-768 | strong in module-heading | 14px | 600 | 21px | -0.2px | 1 |
| analyst-768 | #learning-toolkit-title | 24px | 600 | 30.72px | -0.65px | 1 |
| analyst-768 | #samples-title | 21px | 600 | 28.35px | -0.25px | 1 |
| analyst-1440 | #product-title | 42px | 600 | 50.4px | -0.6px | 2 |
| analyst-1440 | #kit-journey-title | 32px | 800 | 40px | -0.8px | 1 |
| analyst-1440 | #included-title | 25px | 600 | 33.75px | -0.25px | 1 |
| analyst-1440 | #learning-toolkit-title | 23px | 600 | 29.44px | -0.65px | 1 |
| analyst-1440 | #samples-title | 25px | 600 | 33.75px | -0.25px | 1 |
| analyst-1440 | #curriculum-title | 25px | 600 | 33.75px | -0.25px | 2 |
| analyst-1440 | strong in module-heading | 14px | 600 | 21px | -0.2px | 1 |
| scientist-360 | #product-title | 23px | 600 | 29.9px | -0.6px | 3 |
| scientist-360 | #kit-journey-title | 24px | 800 | 30px | -0.8px | 2 |
| scientist-360 | #included-title | 21px | 600 | 28.35px | -0.25px | 1 |
| scientist-360 | #curriculum-title | 25px | 600 | 33.75px | -0.25px | 2 |
| scientist-360 | strong in module-heading | 14px | 600 | 21px | -0.2px | 2 |
| scientist-360 | #learning-toolkit-title | 24px | 600 | 30.72px | -0.65px | 2 |
| scientist-360 | #samples-title | 21px | 600 | 28.35px | -0.25px | 1 |
| scientist-1440 | #product-title | 42px | 600 | 50.4px | -0.6px | 2 |
| scientist-1440 | #kit-journey-title | 32px | 800 | 40px | -0.8px | 1 |
| scientist-1440 | #included-title | 25px | 600 | 33.75px | -0.25px | 1 |
| scientist-1440 | #learning-toolkit-title | 23px | 600 | 29.44px | -0.65px | 1 |
| scientist-1440 | #samples-title | 25px | 600 | 33.75px | -0.25px | 1 |
| scientist-1440 | #curriculum-title | 25px | 600 | 33.75px | -0.25px | 2 |
| scientist-1440 | strong in module-heading | 14px | 600 | 21px | -0.2px | 1 |
| engineer-360 | #product-title | 23px | 600 | 29.9px | -0.6px | 4 |
| engineer-360 | #kit-journey-title | 24px | 800 | 30px | -0.8px | 2 |
| engineer-360 | #included-title | 21px | 600 | 28.35px | -0.25px | 1 |
| engineer-360 | #curriculum-title | 25px | 600 | 33.75px | -0.25px | 2 |
| engineer-360 | strong in module-heading | 14px | 600 | 21px | -0.2px | 2 |
| engineer-360 | #learning-toolkit-title | 24px | 600 | 30.72px | -0.65px | 2 |
| engineer-360 | #samples-title | 21px | 600 | 28.35px | -0.25px | 1 |
| engineer-1440 | #product-title | 42px | 600 | 50.4px | -0.6px | 2 |
| engineer-1440 | #kit-journey-title | 32px | 800 | 40px | -0.8px | 1 |
| engineer-1440 | #included-title | 25px | 600 | 33.75px | -0.25px | 1 |
| engineer-1440 | #learning-toolkit-title | 23px | 600 | 29.44px | -0.65px | 1 |
| engineer-1440 | #samples-title | 25px | 600 | 33.75px | -0.25px | 1 |
| engineer-1440 | #curriculum-title | 25px | 600 | 33.75px | -0.25px | 2 |
| engineer-1440 | strong in module-heading | 14px | 600 | 21px | -0.2px | 1 |
| complete-360 | #product-title | 23px | 600 | 29.9px | -0.6px | 4 |
| complete-360 | #kit-journey-title | 24px | 800 | 30px | -0.8px | 2 |
| complete-360 | #included-title | 21px | 600 | 28.35px | -0.25px | 1 |
| complete-360 | #curriculum-title | 25px | 600 | 33.75px | -0.25px | 2 |
| complete-360 | strong in module-heading | 14px | 600 | 21px | -0.2px | 2 |
| complete-360 | #learning-toolkit-title | 24px | 600 | 30.72px | -0.65px | 2 |
| complete-360 | #samples-title | 21px | 600 | 28.35px | -0.25px | 1 |
| complete-1440 | #product-title | 42px | 600 | 50.4px | -0.6px | 2 |
| complete-1440 | #kit-journey-title | 32px | 800 | 40px | -0.8px | 1 |
| complete-1440 | #included-title | 25px | 600 | 33.75px | -0.25px | 1 |
| complete-1440 | #learning-toolkit-title | 23px | 600 | 29.44px | -0.65px | 1 |
| complete-1440 | #samples-title | 25px | 600 | 33.75px | -0.25px | 1 |
| complete-1440 | #curriculum-title | 25px | 600 | 33.75px | -0.25px | 2 |
| complete-1440 | strong in module-heading | 14px | 600 | 21px | -0.2px | 1 |

## Original CSS definitions and source paths

The representative computed values above include the responsive cascade. Core source definitions and fingerprints follow; all original declarations remain intact in these files.

### css/tokens.css

SHA-256 before experiment: `41f878fbea9c36eb1fb5729becc131c7e1c7c7328d76cd3d3d6641398e033112`

`--font: Manrope, 'Segoe UI', sans-serif`; body `font-family: var(--font); font-size: 15px; line-height: 1.65`; buttons/inputs `font: inherit`. H1/H2/H3: `font-weight: 600; line-height: 1.22; letter-spacing: -0.4px`. H2: `font-size: clamp(23px, 2.5vw, 30px)`; H3: `font-size: 18px`.

### css/home.css

SHA-256 before experiment: `879b3447479a10cedafd632b53cfe46dfb5e30b29af8ff220ae9ac5a37b662ea`

`.hero h1`: `font-size: clamp(30px, 6.4vw, 48px); line-height: 1.2; letter-spacing: -0.6px`, with tablet `clamp(32px, 4.6vw, 48px)` and desktop 48px. `.poster-title`: 25px / 600 / 1.25, desktop 28px. `.kit-copy h3`: 28px / 1.3, tablet 29px, desktop 34px. `.resource-copy h3`: 17px, tablet 16px, desktop 19px.

### css/product.css

SHA-256 before experiment: `9933b5d75d6ccd38d0bf3cf43d6b44f9c358f113c66f8d2591af79fc065e1536`

`.product-intro h1`: 23px / 1.3 / -0.6px tracking; tablet 32px; desktop 42px / 1.2. `.product-section h2`: 21px / 1.35 / -0.25px tracking; desktop 25px. Curriculum module, part and unit headings: 14px / 600 / 1.5. `.benefit-grid h3`: 16px / 600 / 1.5. `.included-grid h3`: mobile 10px, tablet 14px, desktop 13px / 1.45.

### css/career-resources.css

SHA-256 before experiment: `bbe8f3ade5410b978f0da2f471a75e31f8cf9d6cd61183ee6953949217882967`

`.career-hero h1`: `clamp(30px, 3.4vw, 40px)` / 1.2 / -0.6px tracking. Resource library and closing H2: 24px. Resource-card H2: 17px / 1.4. Resource-dialog H2: 23px / 1.35. All inherit original heading weight 600.

### css/learning-experience.css

SHA-256 before experiment: `97dd4d6c612c29fc2b7ec51f2e558f4b25170159f5d31ca7c28831cec15b9c9a`

Learning Hub intro H2 computes to 25px mobile / 32px desktop on home, 25px mobile / 23px desktop on products, line-height 1.28. Toolkit H2 computes to 24px mobile / 29px home desktop / 23px product desktop, line-height 1.28. Toolkit part titles: 17px / 600 / 1.45; edition titles: 14px / 600 / 1.5. Small preview UI headings are preserved in the experiment.

### css/kit-journey.css

SHA-256 before experiment: `8dc5b118a062937f0d89f9b58d205bbb528805c7f02b4126462ddd881691b7a0`

Journey H2: `clamp(24px, 2.5vw, 32px)` / 800 / 1.25 / -0.8px tracking. Step H3: 14px mobile, 15px otherwise / 800 / 1.4.

## Visual references

Before screenshots and per-element computed snapshots: `screenshots/typography-experiment/before/`. All six pages were captured at 1440, 1024, 768, 390 and 360px; full-page references are included at 1440 and 390px. This directory is already ignored by Git. Do not delete it while the experiment is being reviewed.

## Validation requirement

Disable the root class at each of the 30 page/viewport combinations, compare font families, sizes, weights, line heights, letter spacing, heading dimensions and wrapping with the saved before snapshots, then re-enable. Record the final result in `docs/typography-experiment-review.md`.

Validation completed on 2026-10-29: all 30 cases exactly restored the original heading typography, wrapping and measured container dimensions. The experiment was then re-enabled. See the review report for loading observations, responsive comparisons and interaction results.
