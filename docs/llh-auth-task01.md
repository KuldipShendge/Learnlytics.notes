# LLH Task 01 — local authentication frontend

Task 01 is complete and included in the owner-authorized Task 02 release. Real authentication remains inactive; Supabase is not connected. See [Task 02](llh-dashboard-task02.md) for current Dashboard scope and release verification.

## Preview

From the repository, build the inactive production client once, then start the local demo:

```powershell
node scripts/build-llh.mjs
$env:LLH_DEMO = '1'
$env:PORT = '4210'
node scripts/preview.mjs
```

Open http://127.0.0.1:4210/learnlytics-learning-hub. `/llh.html` remains an alias. The marketing site's entry links and the Vercel route have not changed.

1. Choose **Create account**, enter `admin`, and continue. This is an identifier, not an email or privileged account.
2. Enter the simulated OTP `0000`. No email is sent.
3. Choose any four numeric digits, then confirm the same PIN.
4. Select **Continue to LLH**. Task 02 now opens the Dashboard with clearly labeled sample progress and four unavailable feature cards. Open **Account options → Logout** to return to Login.
5. Logout, then use **Sign in**, `admin`, and your chosen PIN in the same tab.
6. Choose **Forgot PIN?** from the PIN screen. Verify using `0000`, then create and confirm a new PIN. The old PIN no longer works.

Reloading, closing or navigating away from the tab clears its temporary account. Another tab has independent state. Try an incorrect OTP or PIN and mismatched confirmation to review validation. The local fixture also simulates code expiry (five minutes), resend cooldown (30 seconds), and a 30-second lockout after five failed attempts. These simulations are not production security controls.

## Isolation

The UI (`js/llh-auth-ui.js`) takes an adapter. The production entry (`js/llh-auth.js`) supplies an inactive adapter that rejects authentication; even valid Supabase build variables do not enable it. There is no production PIN endpoint, account creation, session or paid-resource entitlement.

The local entry and fixture live only under `dev/`. The loopback server injects them only when its process has `LLH_DEMO=1`; a URL parameter, browser flag or identifier cannot enable the demo in a production build. Remote Host headers are rejected. The local entry separately checks the browser hostname.

The fixture retains a random salt and a PBKDF2 verifier in a private, temporary closure. It does not retain plaintext PINs, write to localStorage, sessionStorage, cookies or IndexedDB, or make API requests. Input values are cleared immediately after submission; local inputs opt out of autocomplete. This client-side fixture must never be treated as secure production authentication.

`build-llh.mjs` always bundles the production entry and rejects imports of demo modules. The public allowlist excludes `dev/`, `internal/`, backups, backend code and paid files. Tests inspect every public HTML/JS/CSS file for fixture markers and the bundle for credentials. A browser test also attempts to enter the production flow from localhost and verifies that it cannot reach OTP, PIN setup or the welcome screen.

Real PIN authentication is deferred pending a reviewed server-side design, hashing, rate limits, attempt lockouts and email verification/recovery policies. Existing Supabase security logic is preserved under `supabase/`, `js/llh-auth-utils.js`, `js/llh-config.js`, `js/llh-library-ui.js`, `scripts/llh-admin.mjs`, and `internal/llh/`.

## Backup and scope

Before removal, the previous frontend and tests were backed up to `.llh-test/backups/llh-before-auth-rebuild-fd3badf.zip` (SHA-256 `67F5BB71E8B2B1A48086006EFA06B705E0A8CD9D3D3173F508BF8DA5314060DE`). Git commit `fd3badf` also contains the full previous frontend.

The new HTML and LLH-only stylesheet replace the previous authentication layout. The old public dashboard preview and local buyer/library demo are removed. Shared marketing preview components remain because the main website uses them. No marketing HTML/styles, payment destinations, Supabase migrations or backend functions changed. Existing unrelated logo/PDF working-tree changes remain untouched.

## Changed files

- Replaced: `llh.html`, `css/llh.css`.
- New UI modules: `js/llh-auth.js`, `js/llh-auth-ui.js`.
- New local fixtures: `dev/llh-auth-demo.js`, `dev/llh-demo-adapter.js`.
- Build and preview: `scripts/build-llh.mjs`, `scripts/preview.mjs`, `deployment/public-files.json`, `.vercelignore`, `package.json`.
- Preserved legacy references: `internal/llh/auth-client.js`, `internal/llh/auth-page.html`, `internal/llh/auth-browser.cjs`, `internal/llh/README.md`.
- Validation: `tests/llh-auth-browser.cjs`, `tests/llh-pin-demo.test.mjs`, `tests/llh-build.test.mjs`, `tests/llh-demo.test.mjs`.
- Documentation: this file, `README.md`, `docs/llh-demo-preview.md`, `docs/production-migration.md`, `docs/llh-supabase-setup.md`.
- Removed obsolete UI/demo entry points: `js/llh.js` (auth infrastructure preserved above), `js/llh-preview.js`, `css/llh-preview.css`, `dev/llh-demo.js`, `dev/llh-demo.css`.
- Replaced obsolete browser suites: `tests/llh-browser.cjs` (legacy reference preserved above), `tests/llh-demo-browser.cjs`, `tests/llh-preview-browser.cjs`.

## Verification

```powershell
node scripts/build-vercel.mjs
node --test tests/llh-*.test.mjs tests/deployment.test.mjs
node tests/llh-auth-browser.cjs
```

The browser suite requires Playwright and local Chrome (or `BROWSER_PATH`). `NODE_PATH` may point to the installed Codex runtime's bundled modules. Screenshots of registration, OTP, PIN setup/confirmation, returning sign-in, recovery and the welcome placeholder are written to `screenshots/llh-auth-*-390.png` and `screenshots/llh-auth-*-1440.png`.
