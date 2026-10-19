# Product colour palettes

`css/theme-ds-da.css` applies colour-only overrides to the active blue theme:

| View | Palette | Action colour |
| --- | --- | --- |
| Homepage and Combined kit | Existing royal blue | #0758e8 |
| Data Scientist | Navy, cyan and pale ice blue | #087e9b |
| Data Analyst | Excel-inspired forest green and pale green | #107c41 |
| Machine Learning | Existing indigo, violet and teal | #7040d6 |

DS now has the explicit `scientist-page` body class. The new stylesheet is scoped to that class and `analyst-page`; removing its link restores their shared blue palette. The original plum toggle still disables these overrides. Artwork and brand icons keep their existing colours.

Verified in Chrome at 390, 768, 1024 and 1440px: page-specific accents, home/product navigation, no horizontal overflow, and identical dimensions/fonts with the new stylesheet enabled or disabled. Desktop and mobile hero/curriculum screenshots were visually inspected.
