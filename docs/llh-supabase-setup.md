# Supabase setup — LLH Phase 1

These are manual configuration instructions, not completed remote actions. Work is local; do not push or deploy the website until approved. Use a separate development/staging Supabase project, not a production project with customer records. No Razorpay configuration is needed.

## 1. Create the development project

In Supabase create a project near your users (India when available). Save its database password in your password manager. Once provisioned, copy the **Project URL** and **publishable key** from the project's connection/API settings. A legacy `anon` key also works.

Only these two public values belong in frontend configuration. Never paste a secret key, service-role key, database password or SMTP password into frontend files, chat, Git or Cloudflare public build variables.

## 2. Create the schema

Open the Supabase SQL Editor. Run the complete contents of these files **once, in this exact order**, verifying success after each:

1. `supabase/migrations/202610200001_llh_catalog.sql`
2. `supabase/migrations/202610200002_llh_access.sql`
3. `supabase/migrations/202610200003_llh_admin.sql`

Each migration is transactional. On an error stop and inspect it; do not delete existing tables or rerun already successful migrations. Manual SQL Editor execution does not populate CLI migration history; use this method consistently for this project, or reconcile history before later using `supabase db push`.

Check the seed data:

```sql
select id, price_paise, currency from public.products order by id;
select product_id, kit_id from public.product_kits order by product_id, kit_id;
```

Expected prices in paise: analyst `39900`, scientist `49900`, engineer `49900`, complete `89900`. Complete maps to all three kits. These database prices are provisional configuration; the existing purchase UI is unchanged.

Keep `llh_private` out of **Data API exposed schemas**. Do not add anonymous read/write policies or make all tables public. Migration RLS and function grants already define access.

## 3. Configure email/password authentication

In Authentication settings:

- Enable Email signup/password login and **Confirm email**.
- Disable anonymous sign-ins. Require a minimum password length of **12**.
- Keep refresh-token rotation enabled; use the default 10-second reuse window and one-hour access token expiry.
- Enable secure email changes (confirm both addresses) and secure password changes.
- Use signup/recovery email frequency of at least 60 seconds per recipient. Keep server-side Auth rate limits enabled. The local config uses signup limits of 30, token refresh/password-token requests of 150 and verification limits of 30; hosted UI labels/units should be checked against [Supabase rate-limit documentation](https://supabase.com/docs/guides/auth/rate-limits). The browser cooldown alone is not security.
- Set Site URL to `http://127.0.0.1:4188/Learnlytics.notes` (no trailing slash).
- Add exact redirect URL `http://127.0.0.1:4188/Learnlytics.notes/learnlytics-learning-hub`.

Use the same host and port everywhere. If using port 4193, update both URLs and the local `PORT` accordingly. Do not use broad wildcard redirects in production.

In Email Templates replace **Confirm signup** with `supabase/templates/confirmation.html` and **Reset password** with `supabase/templates/recovery.html`. Their subjects are “Confirm your LearnLytics account” and “Reset your LearnLytics password”.

These templates are required: they send token-hash links to `learnlytics-learning-hub`, where the user presses Continue. The fragment is immediately removed from the address bar. This verifies email or recovers a password; it does not enable passwordless login. Do not substitute the default callback template without changing and retesting the application.

### SMTP

Configure a production SMTP provider before testing real delivery beyond Supabase's limited default sender. Set the provider's SMTP host, port, username/password and a verified sender such as `LearnLytics <accounts@your-domain>`. Store these credentials only in Supabase/provider settings.

Verify the sender domain's SPF and DKIM records and configure DMARC with your mail provider. Disable email click/link rewriting for auth messages. Test confirmation, resend, recovery, expired links and spam-folder delivery on multiple mailbox providers. Provider billing/quotas are separate. See [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

## 4. Connect the local website

Use Node 24 and pnpm 11.25.0. In PowerShell, from the repository:

```powershell
pnpm install --frozen-lockfile
$env:LLH_SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'
$env:LLH_SUPABASE_PUBLISHABLE_KEY = 'YOUR_PUBLIC_PUBLISHABLE_KEY'
node scripts/build-llh.mjs
$env:PORT = '4188'
$env:PREVIEW_BASE_PATH = '/Learnlytics.notes'
node scripts/preview.mjs
```

Open `http://127.0.0.1:4188/Learnlytics.notes/learnlytics-learning-hub`. The public environment values are compiled into the browser bundle. Rebuild after changing them. The scripts do **not** automatically load `.env` files. With no values, the page safely displays “setup is pending”.

Create a test account, open its verification email, press Continue and sign in. Initially all kits should be locked. Signup and verified email alone must never create an entitlement.

## 5. Assign and test kit access

Use four distinct email inboxes you control: DA, DS, ML and Complete. Email aliases are acceptable if your provider delivers them. Create and verify the four accounts through the website; do not simulate verification by editing database rows.

For staging only, enable test grants using SQL Editor:

```sql
update llh_private.settings set allow_test_entitlements = true where singleton;
```

The simplest admin-only method is SQL Editor, which runs as the trusted database operator. Replace the four example addresses with your verified test emails:

```sql
select public.llh_admin_grant_test('da@example.test', 'analyst', 'phase1-da-001');
select public.llh_admin_grant_test('ds@example.test', 'scientist', 'phase1-ds-001');
select public.llh_admin_grant_test('ml@example.test', 'engineer', 'phase1-ml-001');
select public.llh_admin_grant_test('bundle@example.test', 'complete', 'phase1-complete-001');
```

Alternatively use the operator-only `scripts/llh-admin.mjs` CLI with `LLH_ADMIN_SUPABASE_URL` and `LLH_ADMIN_SECRET_KEY` set privately in the local process, then `node scripts/llh-admin.mjs grant <email> <product> <unique-reference>`. Never use that key in the frontend or a public admin page. Clear it from your shell after use.

Refresh My Library. Expected results:

| Account | Accessible kits | Locked kits |
|---|---|---|
| DA | Data Analyst | DS, ML |
| DS | Data Scientist & Gen AI | DA, ML |
| ML | Machine Learning Engineer | DA, DS |
| Complete | DA + DS + ML | None |

Granting an additional product to one account must add access without removing earlier kits. Repeating the same reference must not duplicate it. Test an unverified account and an account without any grants: neither gets resources. Test grants may exist before signup; claiming still requires the matching authoritative verified Auth email.

Revoke after testing:

```sql
select public.llh_admin_revoke_test('phase1-da-001');
select public.llh_admin_revoke_test('phase1-ds-001');
select public.llh_admin_revoke_test('phase1-ml-001');
select public.llh_admin_revoke_test('phase1-complete-001');
update llh_private.settings set allow_test_entitlements = false where singleton;
```

Disabling new grants does not revoke existing ones; use both steps. Revocation blocks subsequent resource requests even before a library refresh.

## 6. Resource backend — leave delivery disabled

The Edge Function is ready in `supabase/functions/llh-resource-access`. No paid files or real Drive links are included. Authorized libraries can show active access with “Resource delivery will appear here once enabled”; that is expected.

After approval to configure the staging backend, install the Supabase CLI and authenticate locally, then:

```powershell
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set LLH_ALLOWED_ORIGINS=http://127.0.0.1:4188 LLH_DELIVERY_ENABLED=false
supabase functions deploy llh-resource-access
```

The runtime injects `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; never add them to public assets. `verify_jwt=false` in the function config is intentional: the handler explicitly verifies bearer tokens using `Auth.getUser`, then checks confirmed identity and database entitlements. Do not remove that verification.

After delivery-method approval, provision a **private** `llh-paid` bucket with no anonymous/authenticated object-read policy, upload approved files and insert their object paths into `llh_private.kit_resources`. Only then enable resource rows and delivery. This migration/upload is not part of Phase 1. The function returns a 60-second signed URL only after access checks. Restricted Drive is currently rejected rather than exposing a permanent URL.

## 7. Cloudflare staging — configuration only until approval

`wrangler.toml` prepares a separate staging project. When staging deployment is approved, connect this GitHub repository to Cloudflare Pages, choose no framework, build with `pnpm install --frozen-lockfile && node scripts/build-public.mjs`, and publish **only `dist`**. Use Node 24 and the pinned pnpm version. Provide only `LLH_SUPABASE_URL` and `LLH_SUPABASE_PUBLISHABLE_KEY` to the build.

Use the staging `pages.dev` domain, without changing live DNS or disabling GitHub Pages. Set Supabase Site URL to that exact origin, add `/learnlytics-learning-hub` as an allowed redirect, and add the origin to `LLH_ALLOWED_ORIGINS`. The templates follow Site URL, so a separate project for local and staging work is simplest.

`dist/_headers` applies the LLH CSP and cache protections on Cloudflare. Confirm those headers on the actual staging response; the local preview and GitHub Pages do not enforce this file. Never publish the repository root: only allowlisted assets and the three existing public EDA sample PDFs are copied.

## 8. Hosted acceptance before approval

- Complete real signup, verification, login, reload persistence, logout and recovery in two browsers.
- Confirm recovery invalidates refresh sessions and the old password stops working. Existing access JWTs can remain valid until expiry; resource access always rechecks entitlements.
- Run the four-account matrix, extra-kit ownership, duplicate grant and revocation checks.
- Call library/private/admin APIs directly with anonymous and normal-user credentials: no private locators, self-grants or cross-user access.
- Use a harmless staging fixture, only after storage approval, to test authorized download, cross-kit denial, expired signed URL and revoked access.
- Verify public artifact contents and CSP. Test server-side rate limiting with controlled test accounts, without sending bursts of real email.

No production customer access should depend on `admin_test` grants. A future Phase 2 verifier will create `verified_purchase` entitlements after server-side payment checks. This implementation does not create payment records or trust a browser-supplied purchase claim.
