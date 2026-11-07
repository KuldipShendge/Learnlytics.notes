# LLH Task 02 — dashboard release

This release combines Task 01's authentication UI with the main Dashboard. The existing `/learnlytics-learning-hub` URL, `/llh.html` alias, marketing links and Razorpay Payment Pages remain unchanged.

## Available scope

The Dashboard has a personalized greeting, an explicitly labeled sample-data notice, study-completion ring, chapters-completed count, weekly activity visualization, four feature cards, in-page overview/tools navigation, and an account control with Logout.

The cards are **My Library**, **Study Tracker**, **7-Day Interview Readiness**, and **Career Tracker**. All four are nonfunctional placeholders with disabled controls and no feature URLs. Career Tracker is labeled Coming soon. No inner pages, purchased resources, tracking writes, readiness questions or career functionality are implemented.

Task 01's Login/Registration/PIN layout and stylesheet are preserved. Successful local demo authentication now mounts the Dashboard in place of the welcome placeholder. Logout removes the Dashboard and its event listeners and restores the returning-user Login UI. The mock progress is presentation data only, separate from authentication and entitlements.

## Production limitation

The owner authorized committing both tasks and pushing `main` for Vercel deployment. The public Login UI remains inactive: it cannot accept local demo credentials, send OTP email, create accounts or open the Dashboard through sign-in. Supabase is not connected and configuring public variables does not enable the inactive adapter. Production dashboard assets are shipped for future integration; the complete flow can currently be exercised only through the loopback demo. No public dashboard bypass or alternative preview route was introduced.

All mock authentication remains in excluded `dev/` files, never in `dist`. Preserved legacy auth infrastructure stays under excluded `internal/`. A public-build scan checks for demo credentials/verifiers, and browser checks confirm the production UI cannot reach OTP, PIN or Dashboard even on localhost or with a demo URL parameter.

## Local review

Use the [Task 01 instructions](llh-auth-task01.md): http://127.0.0.1:4210/learnlytics-learning-hub with the explicitly enabled local demo. Complete registration, enter the Dashboard, open **Account options → Logout**, then test returning sign-in. Reload clears the local account; progress remains static sample data and is never saved.

## Changed files

New dashboard files:
- `js/llh-dashboard.js`: presentation, account controls and lifecycle cleanup.
- `js/llh-dashboard-data.js`: clearly identified sample progress and feature definitions.
- `css/llh-dashboard.css`: scoped responsive dashboard styles.

Integration and validation:
- `js/llh-auth-ui.js`: successful local authentication → Dashboard → Logout transition.
- `llh.html`: dashboard stylesheet.
- `deployment/public-files.json`: allowlisted dashboard assets.
- `tests/llh-auth-browser.cjs`: auth regression plus dashboard, disabled cards, navigation, logout and responsive captures.
- `tests/llh-live.cjs`: read-only deployment, production isolation, artifact identity and existing Razorpay destination checks.
- `README.md`, `docs/llh-auth-task01.md`, `docs/llh-demo-preview.md`, `docs/production-migration.md`, and this file: current scope and deployment guidance.

The commit also includes all previously completed Task 01 changes listed in [its file inventory](llh-auth-task01.md#changed-files), including the preserved legacy references. Pre-existing unrelated logo additions/deletions and PDF deletions are excluded from the release.

## Verification

`node scripts/build-vercel.mjs` builds only allowlisted files. `node --test tests/llh-*.test.mjs tests/deployment.test.mjs` covers auth utilities, demo state, isolation, public output, unchanged payment links, PostgreSQL RLS and resource authorization.

`node tests/llh-auth-browser.cjs` checks the full local Login → Dashboard → Logout and PIN-recovery flow, zero persistent demo storage/API calls, all four disabled feature cards, account keyboard handling, in-page navigation, production auth denial, and widths 320/390/768/900/1440. Screenshots: `screenshots/llh-dashboard-{width}.png`.

After Vercel succeeds for the pushed commit, `node tests/llh-live.cjs` verifies the canonical live URL, exact deployed bundle, Login rendering at 390/768/1440, blocked demo credentials, excluded paths, and four Razorpay Payment Page destinations. The Dashboard itself is reviewed locally; no live authentication bypass is used to claim an end-to-end production login test.

## Dashboard design refinement

The dashboard now uses a dark green desktop sidebar, a stronger completion card, clearer typography, and quieter feature cards. Tablet navigation becomes a compact icon rail; mobile navigation and account controls stay available while scrolling. The Login layout, marketing pages, payment links and backend remain unchanged.

The weekly activity chart displays exact sample minutes. Click, tap or keyboard-activate a day to inspect it, then use Reset to restore the weekly total. Selection is temporary presentation state and never saves progress or makes a backend request. Overview and Learning tools update both the active navigation indicator and breadcrumb, including when scrolling to the end of a shorter desktop page. The account popup closes on Escape, an outside click or keyboard focus leaving it.

The four feature cards remain disabled placeholders. This refinement changes only `js/llh-dashboard.js`, `css/llh-dashboard.css`, the local/live browser checks, and this release note. Browser checks cover chart values and reset, keyboard/account interactions, active navigation, and responsive layouts alongside the existing full authentication regression. The live check compares the deployed dashboard stylesheet and modules with the tested release as well as the bundled application.
