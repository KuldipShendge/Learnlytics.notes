# Learning Hub and Project Explanation Toolkit visual previews

Status: marketing previews, with publishing authorized by the user on
17 October 2026 after local review. Learning Hub and Toolkit are both labelled
Coming Soon; publishing these previews does not release the actual features.

## Files

- index.html: stylesheet, hero mounts and three promotional content mounts.
- js/learning-experience.js: shared semantic renderer, view-specific copy and
  separate launch labels for Hub and Toolkit, subject/path configuration and
  static dashboard/project-framework preview renderers.
- css/learning-experience.css: responsive styles using existing tokens/Manrope.
- assets/images/project-explanation-toolkit.webp: generated product artwork.
- docs/toolkit-product-artwork.md: image provenance and exact generation prompt.
- js/main.js: initialize homepage marketing before the existing videos.
- js/product.js: initialize DA/DS marketing before existing videos and curriculum.
- tests/product.cjs and tests/analyst.cjs: update the curriculum's expected next
  neighbour to account for the newly inserted promotional section.
- This document: placement, future video integration and verification.

## Exact placement

### Homepage

The hero's existing supporting-copy block now holds the requested bold secondary
message, short description and Learning Hub availability line. The h1, image,
career navigation, guide button and kit CTA remain in place.

The Learning Hub introduction appears immediately before the first guide video,
after the hero. Its dedicated homepage mount is data-learning-hub-slot.
It uses two columns on desktop: concise copy and three short feature labels on
the left, a dashboard concept preview on the right. On mobile the preview follows
the text. Project Explanation Toolkit stays after the three-resource showcase
(#inside), before the purchase/access explanation (#how-it-works). The Handbook /
Practice Workbook / Solution Manual trio remains three core components.

### DA and DS

Each product hero has a short benefit line just above the existing statistics,
with a Learning Hub Coming Soon label. The title, description, image, statistics,
price, checkout buttons and checkout implementation are unchanged.

Desktop order in the primary column:
How to Use Your Kit > What's Inside This Kit? > Learning Hub > Project
Explanation Toolkit > Sample Pages. Curriculum stays in the sidebar.

Mobile order:
How to Use Your Kit > What's Inside This Kit? > Complete Curriculum > Learning
Hub > Project Explanation Toolkit > Sample Pages. This preserves the previously
requested curriculum placement immediately after the resources overview.

DA copy focuses on analytics preparation, tests and Analytics Engineering career
paths. Its planned tracking note is 80 comprehensive handbook chapters.
DS copy focuses on Data Science/GenAI preparation and Data Science, ML Engineering
and GenAI career paths. Its planned tracking note is 140 chapters.
These describe future tracking, not completed progress or curriculum edits.

## Visual revision

All three views share the same renderers and theme tokens. Desktop Hub layouts split
copy and preview at 980px; smaller screens stack them in reading order. The
Hub and Toolkit variants fit inside the existing primary column. Their placement
is unchanged by the sidebar follow-up below.

### Product sidebar follow-up

At desktop widths (980px and above), both product pages now use this right-column
order: Complete Curriculum > Find Your Fit video > Why This Kit Is Different >
Who Is This For? > Need Help? > Tools & Technologies Covered. The entire difference
card and audience block move together using the shared responsive placement
function in js/product.js. The columns flow independently, so Tools sits 39px
below Help instead of waiting for the left column to end. Reviews remain in the
left column after Sample Pages. At smaller widths, the existing reading order is
preserved: curriculum after the included resources; difference and audience after
Sample Pages and before reviews. Resizing reuses the same sections without copies.
DS, DA and testimonial browser suites passed at 360, 390, 430, 768, 1024 and
1440px, including sidebar order and the 39px Help-to-Tools gap on desktop.

### Static reviews follow-up

Both product pages display all four existing reviews in a two-column, two-row
grid from 560px, or one vertical column below 560px. Carousel controls, automatic
timers, swipe/keyboard handlers and horizontal scrolling were removed. Read More
is plain text with the existing arrow style; its destination is deferred at the
user's request. No fixed card heights or extra section padding were added. The
responsive review checks passed at all six widths, including a 52px gap from the
review section to the closing card at 1024 and 1440px on both pages.

The Hub preview contains My Library, a chapter preparation example with Handbook,
Warmup Test and Interviewer Test states, and a career path with next-skill chips.
Homepage shows both kits; DA and DS show their respective kit and six subjects.
The homepage dashboard uses a compact internal grid on desktop. Product previews
stack the three panels to remain readable inside their narrower columns.

The Toolkit shows an example project story (Problem, Approach, Tools used,
Outcome, Business impact), an interviewer prompt and the answer flow Situation >
Method > Decision > Result. DA uses sales analysis and a stakeholder prompt;
DS uses churn prediction and a model-selection/evaluation prompt.

Both features remain Coming Soon. Progress is explicitly labelled Example and
Illustrative progress; no numbers represent real users or live progress. Preview
actions are plain text spans, not links/buttons, and do not enter the tab order.
There are no event handlers, persisted tracker state, requests or dependencies
in the preview module. Semantic figures, headings, lists and definition lists
keep the illustrations readable by assistive technology. Decorative icons and
progress fills are hidden from screen readers; the status words remain readable.

Toolkit copy now sits above the visuals on all three pages. Below it, the new
product artwork and existing project framework sit side by side when the card's
content area is at least 560px wide, and stack in narrower columns or on mobile.
The artwork caption reads "How To Explain Your Projects
Confidently In Interview", followed by the smaller "This Toolkit Is Answer".
The generated image is assets/images/project-explanation-toolkit.webp; the
built-in generation prompt is recorded in toolkit-product-artwork.md. The Hub
and framework previews remain lightweight HTML/CSS with the existing SVG sprite.

## Updating availability

Edit learningRelease.hub and learningRelease.toolkit at the top of
js/learning-experience.js. Both hero/section labels and availability copy reuse
these values. Review the view copy when launching; this change does not enable
accounts, trackers or Toolkit downloads.

## Add the dedicated Learning Hub video later

There is a comment marking the insertion point after .learning-hub-footer in the
shared renderer. Once a real explainer is available:

1. Add a new hub entry with its title, youtubeId and optional local cover to
   js/video-config.js. Keep the existing use and choose entries.
2. At that insertion point, render a responsive video slot with
   data-inline-video="hub" using the existing .product-video pattern. A dedicated
   .learning-hub-video rule can set aspect-ratio:16/9 and min-height:0 so it fits
   either page layout without fixed mobile height.
3. setupLearningExperience already runs before setupInlineVideos in both
   initializers, so the existing player can discover the new slot. Preserve
   its click-to-play, idle autoplay=0 and view-leave cleanup behavior.
4. Update the video cache versions and tests that currently expect exactly two
   videos per view. Verify mobile covers/playback and Back/Forward cleanup.

No new player was added. The visual dashboard is an explicitly labelled concept
preview; it does not provide actual Hub access.

## Verification

Passed existing homepage, product and analyst browser tests at 360, 390, 430,
768, 1024 and 1440px, including curriculum, sample PDFs, videos, CTAs and overflow.
Navigation and testimonial slider/alignment checks passed during the preceding
integration; their code was not changed in this visual revision.
Theme rollback was also rechecked for the visual revision at 390 and 1440px on
home, DA, DS and About: layout stayed identical and the original colours restored.

Additional local browser QA inspected all three promotional sections at the same
six widths: one Hub and one Toolkit per active view, both availability labels,
three planned benefits, chapter notes and no horizontal overflow. Screenshots
were inspected at 390 and 1440px. No real API, checkout or email submission was
made. JavaScript syntax checks and git diff --check passed. This plain static
project has no build or lint script and no new dependencies were added.

The subsequent product-artwork update passed homepage regression checks and
targeted browser QA in all three views at the same six widths: homepage Hub
before videos, Toolkit introduction above its visuals, image decoding, exact
caption text, two existing video players and no page or inner-content overflow.

Local preview: http://127.0.0.1:4187/Learnlytics.notes/
Select Data Analyst or Data Scientist in the existing career selector and open
the kit details to preview each product view at the same URL.

## Limits

Learning Hub, the dedicated explainer video and Toolkit are not released and
have no live access in this task. Existing About/Career Resources content,
curriculum data, pricing, payments and delivery were not edited.
