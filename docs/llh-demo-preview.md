# Local Learning Hub demo

The website header links to `llh.html` beside the logo on every view. This relative URL works at the domain root (including Vercel static hosting) and at `/Learnlytics.notes/`. Existing purchase controls and prices are unchanged.

## Open the preview

Run from `D:\GitHub Repos\Learnlytics.notes`:

```powershell
$env:LLH_DEMO = '1'
$env:PORT = '4194'
$env:PREVIEW_BASE_PATH = '/Learnlytics.notes'
node scripts/preview.mjs
```

Open http://127.0.0.1:4194/Learnlytics.notes/llh.html

- Username: **admin**
- Password: **admin**
- Select DA-only, DS-only, ML-only or Combined Kit in the buyer selector.
- Combined includes DS + Gen AI, ML, and Data Analyst bonus access.
- Study and Career Trackers reuse the existing concept-preview components. Their progress is illustrative.
- “Open resource” shows a demo explanation dialog, not a paid PDF.
- Refreshing the browser or signing out resets everything. No data is stored in localStorage, sessionStorage or a database.
- Inspect mobile using browser device mode at 390px, and desktop at 1440px. The header is also tested at 320px and 900px.

If the preview is already running on port 4194, use the link directly. Stop your foreground server with Ctrl+C. To return to the real auth frontend, remove `LLH_DEMO` from the process environment and restart the server. No Supabase connection is required for the demo.

## Separation from real authentication

Only the explicitly enabled **loopback preview server** substitutes a local script into the served HTML. The on-disk `llh.html` still loads the real Supabase client. No query parameter, username, URL fragment, browser flag or stored session enables a production demo.

The demo has no Supabase SDK import, API requests, auth tokens, database grants or administration privileges. Its page has `connect-src 'none'` and `form-action 'none'`. The server binds to 127.0.0.1 and rejects non-local Host headers.

`dev/llh-demo.js` and `dev/llh-demo.css` are outside the public deployment allowlist. `node scripts/build-public.mjs` always generates the real auth page, even if `LLH_DEMO=1` is set. Publish **only `dist/`**, never the repository root or `scripts/preview.mjs`; this applies to staging and future Vercel production hosting. Build tests scan output for demo code/credential markers.

## Files changed for this task

- `index.html`, `css/navigation.css`: responsive LLH link beside the logo in eight headers.
- `js/llh-library-ui.js`, `js/llh.js`: shared library-card renderer; real authentication stays independent.
- `js/learning-experience.js`: exports the existing tracker preview renderer for reuse.
- `scripts/preview.mjs`: explicit local-only demo serving, host/path validation and restrictive demo CSP.
- `dev/llh-demo.js`, `dev/llh-demo.css`: in-memory demo login, mock kit data and buyer selection.
- `deployment/public-files.json`: includes only the shared public renderer, not demo files.
- `tests/llh-demo.test.mjs`, `tests/llh-demo-browser.cjs`, `tests/llh-build.test.mjs`: isolation, layout, login and production-exclusion checks.
- `docs/llh-demo-preview.md`: this guide.

Screenshots are saved locally under `screenshots/llh-demo-*.png` and are not deployment assets. No Git push, Vercel deployment, Supabase configuration or payment changes are part of this task.

## Verification

- All 6 LLH automated tests passed, including explicit local opt-in, blocked remote Host/path traversal, unchanged purchase controls and demo exclusion from a build run with `LLH_DEMO=1`.
- Demo browser tests passed at 320/390/900/1440px for the header and 320/390/1440px for the library. All four buyer selections, locked kits, tracker previews, the resource dialog, no API/storage use, reload reset and signout passed.
- Existing website navigation tests passed.
- Existing real-auth browser tests passed on a separate non-demo server using mocked Supabase responses. No hosted Auth or SMTP configuration was performed.
- Desktop and mobile screenshots were visually inspected.
