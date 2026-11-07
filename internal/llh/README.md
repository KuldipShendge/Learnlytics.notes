# Preserved password-auth infrastructure

Task 01 replaces the active LLH frontend only. `auth-client.js` preserves the prior Supabase password/verification/recovery/session/library implementation. Its imports now point to the retained shared modules in `js/`; only the obsolete public-preview fallback was removed. `auth-page.html` and `auth-browser.cjs` preserve its previous DOM contract and browser-test reference.

These are archival integration references, not active entry points or runnable Task 01 tests. The old browser reference names its historical source entry point; adapt its harness before reusing it. None of this directory is served by the preview server, copied into `dist`, or uploaded by the Vercel CLI. Supabase migrations, functions, configuration, templates, auth utilities and operator tooling remain unchanged.

Do not connect this password client to the new PIN UI. Production PIN authentication requires a separately reviewed backend design with server-side verification, appropriate hashing, rate limits, attempt lockouts and verified recovery.
