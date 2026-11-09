# LLH Supabase email OTP authentication — release verification

This supersedes the Task 01 PIN demo and Task 02 inactive-auth descriptions. The existing HTML/CSS/JavaScript Login now uses the installed Supabase JS client. No framework migration, dashboard layout redesign, feature interiors, payment changes, migrations or backend security changes are included.

## Flow

Email → send six-digit OTP → verify email → first-time name setup → Dashboard. Returning users with `user_metadata.full_name` skip name setup. Names are presentation metadata, never authorization data. The client uses `signInWithOtp`, `verifyOtp` with type `email`, and `updateUser` for the display name. OTP resend has a 60-second UI cooldown; Supabase remains responsible for enforcing actual rate limits and code expiration.

Supabase manages persisted sessions and token refresh under `llh-auth-session`. Dashboard entry and session restoration require a successful server `getUser()` response with a verified email. Auth events handle sign-out across tabs; returning to a tab revalidates its user. Logout signs out the current session. Session verification failures fail closed. Backend RLS and resource authorization remain the security boundary for future private data; dashboard sample data does not grant resource access.

The supplied project URL and publishable key are browser-safe configuration in `scripts/build-llh.mjs`; environment variables `LLH_SUPABASE_URL` and `LLH_SUPABASE_PUBLISHABLE_KEY` can override them. Secret/service-role keys are rejected. No private keys are required. PIN UI and the development demo adapter are removed, and `LLH_DEMO`, URL query flags and old local module URLs cannot enable a bypass. Two-session limits and 15-day reauthentication are intentionally not implemented.

## Local preview

Run `node scripts/build-llh.mjs`, then set `PORT=4211` and run `node scripts/preview.mjs`. Open http://127.0.0.1:4211/learnlytics-learning-hub. Enter a real accessible email, use the latest code, and enter your name if prompted. The same email uses OTP for later sign-ins. No demo identifier or PIN is accepted.

## Verification — 2026-11-09

- Real Supabase email OTP delivery and verification succeeded using the owner's provided test email/code. Name saved as LearnLytics; Dashboard opened, reload restored and server-verified the session, and real logout prevented access after another reload. The verification reused the already delivered code without sending a duplicate email.
- Browser network-fixture checks passed for incorrect/expired OTP, resend cooldown, name setup, returning-user name skip, persistence, logout, rejected sessions, keyboard navigation, dashboard sample interactions, and widths 320/390/768/900/1440. These fixtures exist only in tests.
- Seven Node regression checks passed, including production output isolation, existing payment links, PostgreSQL RLS, and resource authorization.
- Production build passed. `dist` excludes demo/internal code and private files. Dashboard CSS is unchanged; only account copy now says Signed in / Verified email session.
- Production deployment is authorized for this release. `tests/llh-live.cjs` checks deployed artifact identity, public path exclusions, marketing routes and Razorpay destinations. `tests/llh-live-otp.cjs` performs a separate real email OTP → Dashboard → reload/session restore → cross-tab Logout check; it requires an authorized mailbox and interactive OTP input. Reports are written under excluded `screenshots/`.

Official API reference: https://supabase.com/docs/reference/javascript/auth-verifyotp

## Final cleanup

Removed after dependency review:

- `dev/llh-auth-demo.js`
- `dev/llh-demo-adapter.js`
- `tests/llh-pin-demo.test.mjs`
- `internal/llh/auth-client.js`
- `internal/llh/auth-page.html`
- `internal/llh/auth-browser.cjs`
- `internal/llh/README.md`
- `js/llh-config.js`
- `js/llh-library-ui.js`
- `docs/llh-demo-preview.md`

The old client, markup, library renderer and config formed an unused archival dependency chain, referenced only by their retired browser suite/documentation. Current auth helpers, local preview/build tools, automated tests, Supabase migrations/functions and operator tools are retained. Network fixtures in regression tests remain excluded from public output; no runtime mock auth or fake session generator exists in shipped app code. The CSP is narrowed to this Supabase project. Public output scanning rejects secret keys, privileged JWTs, private keys and database connection strings, in addition to excluding private files. Existing unrelated local PDF/logo changes are excluded from this release.
