# Machine Learning product page

The homepage ML Engineer tab opens `view-engineer` at the existing site URL. Browser history and refresh use the same mechanism as DA/DS.

Content comes from `D:/website/index.html`, section `#course-ai-automation`: seven modules, 20 parts, 60 resources, price Rs 499 (original Rs 1,499), and four existing reviews. Module and part titles, handbook pages and workbook question counts were transcribed into `js/ml-curriculum.js`. The original headline says 3,680+ questions while the detailed workbook rows total 3,420; the page preserves those source figures. This source discrepancy remains for editorial correction.

The page reuses the DA/DS product structure, the supplied MLOps v2 handbook, workbook and solutions sample PDFs, the two existing guide videos with autoplay off, and static four-card reviews. Learning Hub and Project Explanation Toolkit remain labelled Coming Soon, with ML-specific preview copy. Checkout keeps the existing purchase-information dialog; this change does not integrate payments.

`css/theme-ml.css` is scoped to `html[data-theme="blue"] .engineer-page`. Deep indigo text, violet actions and pale teal accents apply only to ML. No layout or font overrides. Existing product artwork, guide covers, logo and technology brand colours are retained. Removing this stylesheet link returns ML to the shared blue theme.

Validation: `tests/engineer.cjs` covers six viewport widths, module/part counts, MLOps content, PDF reading through all 32 pages, idle video embeds, reviews, purchase dialog, same-URL history/refresh and colour isolation across home/DA/DS.
