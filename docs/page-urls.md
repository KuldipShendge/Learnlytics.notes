# Public page URLs

Production origin: **https://www.learnlyticshandbook.shop**. Source and all pushes remain in **KuldipShendge/Learnlytics.notes**, deployed by the owner's existing Vercel connection.

| Page | Path |
|---|---|
| Home | `/` |
| Data Analyst | `/data-analyst` |
| Data Scientist & Gen AI | `/data-scientist-gen-ai` |
| ML Engineer | `/machine-learning-engineer` |
| All-in-One Combo | `/all-in-one-combo` |
| Career Resources | `/Career-Resources` |
| About Us | `/about-us` |
| Learner reviews (Read More) | `/learner-reviews` |
| Learning Hub | `/learnlytics-learning-hub` |

`js/site-routes.js` defines the frontend paths. Vercel has explicit rewrites for those paths, and explicit redirects for supported old URLs. Unknown URLs return 404. The design and payment destinations are unchanged. Public page navigation uses browser history; reload and shared links resolve from the URL rather than a previous tab's saved view.

Local: run `node scripts/preview.mjs`, then open `http://127.0.0.1:4173/data-analyst` or any other path above. `PREVIEW_BASE_PATH=/Learnlytics.notes` additionally tests project-folder URL resolution. Production clean URLs require Vercel's rewrites; GitHub Pages does not implement these rewrites.

LLH retains `/llh.html` as a compatible alias so previously issued verification links keep working. The new LLH route carries the same no-store, no-referrer, noindex and CSP protections. Demo code remains local-only. When configuring Supabase, use the production origin as Site URL (no trailing slash), and add the exact `/learnlytics-learning-hub` URL to the redirect allowlist. Retain `/llh.html` there while old emails may still be in use. The supplied confirmation/recovery templates now use the new route; applying templates in Supabase is manual.

Checks:

```powershell
node scripts/build-vercel.mjs
node --test tests/deployment.test.mjs
$env:PREVIEW_URL='http://127.0.0.1:4173/'
node tests/page-routes.cjs
node tests/navigation.cjs
node tests/legacy-entry.cjs
```

The browser checks cover direct navigation, refresh, new tabs, Back/Forward, section links, campaign query parameters, mobile/desktop widths, legacy redirects and unknown-path denial. The deployment allowlist checks ensure demo/backend/private resources remain excluded.
