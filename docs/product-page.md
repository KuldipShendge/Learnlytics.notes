# Data Scientist & Gen AI product page

## Requested changes

- New mobile-first product page using the supplied second reference for structure and text only. Both pages share LearnLytics plum `#241525`, magenta `#b40982`, pale blush `#faf4f8` and Manrope from `css/tokens.css`; the product page does not override the brand tokens.
- Manrope font and existing LearnLytics logo; a new CSS book illustration matches the product palette.
- Main and sticky “Get This Kit Now” buttons, with the Razorpay label below the main button. These open a purchase-availability dialog; no transaction is initiated.
- “How to Use Your Kit” and “Choose the Right Kit” open the supplied YouTube guides in the shared player, with a direct YouTube link and cleanup when closed.
- Resource inclusion cards, real sample images with tabs/carousel/enlargement, benefits, audience, generated SVG technology icons, seven expandable modules, and WhatsApp support.
- No FAQ section, file-format badges, or 7-day refund claims on the product page.
- No invented student ratings, testimonials or bestseller status. A sample-material confidence section occupies that portion of the reference instead.

## Verified original curriculum

The detailed source is the `ds-preparation-title` section in `D:\website\index.html`, immediately after **20 parts. 60 resources. One complete kit.** The new `js/ds-curriculum.js` contains those exact module and part names and the practice-workbook question counts. The totals block is positioned below the module cards.

| Module | Parts | Practice questions |
| --- | ---: | ---: |
| Mathematics & Statistics For Data Science | 2 | 490+ |
| Python for Data Scientist | 3 | 510+ |
| EDA & Feature Engineering | 3 | 540+ |
| Classical Machine Learning | 3 | 500+ |
| Model Evaluation, Selection & Tuning | 3 | 480+ |
| Deep Learning | 4 | 500+ |
| Generative AI & LLM Integration | 2 | 260+ |
| **Total** | **20** | **3,280+** |

**Source discrepancy and confirmed display choice:** The old headline advertises **3,680+** practice questions, but its detailed parts and module totals add up to **3,280+**. The user explicitly selected option 2: **retain the 3,680+ headline; detailed counts need correction**. The headline is stored separately as `productOverview.practiceQuestions`. Module counts remain transcribed from the old source until corrected values are provided; no additional questions have been assigned to arbitrary modules. Three resources per part gives **60 resources**.

The old Data Engineering & Code Quality part lists 180+ workbook questions but 250 solution answers. The product page uses the workbook count for its question totals and avoids asserting a separate answer count.

## Assets and placeholders

- `assets/icons/product.svg`: scalable SVG drawings for Python, SQL, machine learning, deep learning, Gen AI and LLMs, plus supporting interface icons.
- The plum book and guide posters are new HTML/CSS illustrations using the existing LearnLytics palette.
- `assets/images/samples/`: copied six existing `ds-python`, `ds-evaluation` and `ds-genai` handbook/solution preview images from `D:\website\images\ml-pdf-samples`.
- No authentic workbook sample was available in the old preview assets. The workbook tab is explicitly labelled **Illustrative practice preview** and contains newly authored example questions. Replace it with actual previews when provided.
- Published guides: `gAV7onDGlNo` (how to use the kit) and `1hUTxkkk5jQ` (choose the right kit). Both homepage and DS guide buttons use these IDs.
- Existing WhatsApp contact verified from the old Data Scientist product section: `https://wa.me/919130631497`. Links only open the user's WhatsApp conversation; the website does not send a message automatically.
- Displayed price, struck price and discount match the old catalog: ₹499, ₹1,499, 67% off. No payment logic, credentials, tracking or delivery services were copied.

## Verification

`tests/product.cjs` checks 360, 390, 430, 768, 1024 and 1440px, module/part/question totals, all accordions, excluded UI text, Manrope loading, mobile menu, purchase placeholders, sample types and topics, keyboard tab controls, image enlargement, both guides and the WhatsApp destination. The expected YouTube embeds are stubbed during browser acceptance tests; other nonlocal requests are blocked. Real playback is verified separately.

`tests/homepage.cjs` additionally verifies the shared navigation and the featured product entry. `tests/product.cjs` verifies the shared palette and the Data Scientist career tab and featured-card link. These switch to the embedded DS view at the same URL; JavaScript is required. `tests/navigation.cjs` covers About Us, sample links, repeated visits, browser Back/Forward, and refresh. Results and screenshots are in `screenshots/` (ignored by Git).

The DS and About Us markup now lives in templates inside `index.html`. Separate URLs are deferred to v2. GitHub Pages needs only the static entry point, with relative assets that also work under `/Learnlytics.notes/`; no route rewrites are needed.

## Product artwork and aspirant stories

DS and DA use larger covers: up to 205px on phones, 280px on tablets and 340px
on desktop, limited by their responsive columns. WhatsApp actions remain green
in the blue theme, including the purchase dialog contact link.

Both product pages preserve the old quotes and channel icons. The centered
heading has green divider lines; four cards share a desktop row, two columns
fit tablets, and phones use a native horizontal swipe track. Slides advance
every 4.5 seconds only while the section is visible. Touch interaction, keyboard
focus, hovering, hidden tabs, leaving the view and reduced-motion preferences
stop automatic movement. Dots and a pause/resume control support manual use.
`tests/testimonials.cjs` checks real touch input, automatic movement, controls,
repeat visits, larger cover widths, desktop card placement and WhatsApp colours.
