# Learnlytics.notes production deployment

Production source: **KuldipShendge/Learnlytics.notes**. All future changes and pushes stay in this repository; do not transfer or push to `learnlytics.handbook`. The user has connected this repository to Vercel. The confirmed canonical domain is **https://www.learnlyticshandbook.shop/**.

## Deployment files

| File | Purpose |
|---|---|
| `vercel.json` | Static framework, pinned install command, Vercel build, `dist` output, security/cache headers and explicit old-link redirects |
| `.vercelignore` | Excludes local demo, backend, credentials, tests, logs and other non-build inputs from CLI upload |
| `scripts/build-vercel.mjs` | Runs the existing allowlisted build; fails if an obsolete root `api/` directory is present |
| `deployment/public-files.json` | Exact files allowed in the public artifact, including current images, fonts, video covers, PDF.js and three public EDA sample PDFs |
| `sitemap.xml` | Homepage and individual public page URLs; LLH stays noindex |
| `robots.txt` | Sitemap location and crawl rules; excludes account/resources paths from indexing |
| `index.html` metadata | Existing Search Console verification, canonical domain, current Open Graph/Twitter metadata and basic Organization JSON-LD |
| `.env.example` | Optional public Supabase configuration names; no secrets required for the marketing site |
| `js/legacy-entry.js`, `js/views.js` | Old fragment bookmarks resolve to the appropriate new page URL |

Current images, logos, local fonts, technology icons, video covers and PDF viewer dependencies are already in this repository. Preserve their filenames and capitalization. The allowlist prevents unrelated old PDFs, source files and local logo copies from appearing in the public site.

Vercel rewrites only known page URLs to the existing frontend; unknown paths return 404. Old kit URLs redirect to their new paths. See [page URLs](page-urls.md) for the full list.

The old `/aptitude-kit` and `/all-handbook-page/de` pages have no equivalent in this redesigned site and are not in the new sitemap or redirect table. Restoring those products is a separate content task.

## Vercel settings

Keep the Git connection on **KuldipShendge/Learnlytics.notes**, branch **main**. Use Framework **Other**, Node **24.x**, install `pnpm install --frozen-lockfile --ignore-scripts`, build `node scripts/build-vercel.mjs`, and output **dist**. `vercel.json` supplies the commands and output directory.

Publish only the allowlisted build output. Do not copy an old backend into this repository: the build rejects a root `api/` folder. Keep secrets, local demo files, admin scripts and paid resources outside public output. The existing GitHub Pages workflow is preserved; Vercel is the production host for the new clean URLs.

Review Vercel build results and check the routes after pushing. DNS is managed by the owner; no DNS changes are required by this code update.

The Google Apps Script Career Resources endpoint is already in `js/career-resources-data.js`; keep the current working endpoint. The script source is in `google-apps-script/form-handler.gs` for manual maintenance, not a Vercel Function. No new script deployment is needed just to move the frontend.

## Current operational state

- The four temporary hosted Razorpay payment links remain unchanged. There is no Orders API, payment webhook or automatic kit granting yet.
- LLH remains “setup pending” unless its public Supabase URL and publishable key are configured. Do not promise automatic access after purchase until the future payment verifier exists.
- The `admin/admin` preview is local only. It is not part of `dist` and must never be deployed as an auth option.
- Vercel LLH CSP permits hosted `https://*.supabase.co` connections. When enabling Supabase, narrow `connect-src` to the exact project origin. A custom Supabase domain must be explicitly added before use; the Cloudflare `_headers` file is not used by Vercel.
- Real paid files, permanent Drive delivery links and all secret keys remain outside public output. Robots rules are indexing hints, not access control.

## Why some old files were not copied

The old `api/pdf-sample.js` and `free-ml-part-01.html` expose permanent Drive URLs. Current sample reading uses the existing local EDA samples, and free resources are delivered through Apps Script. Their backend/standalone download code is unnecessary; the old free-page URL redirects to Career Resources.

Old product schema contained outdated counts, prices and aggregate reviews. Only current, supported Organization metadata was carried forward. Old tracking pixels, unrelated images and duplicate frontend scripts were not introduced.

## Local validation

```powershell
pnpm install --frozen-lockfile
node scripts/build-vercel.mjs
node --test tests/deployment.test.mjs
```

`dist` must contain `index.html`, `llh.html`, `robots.txt`, `sitemap.xml`, allowlisted public assets and the generated LLH bundle. It must not contain `dev`, `api`, `server`, `supabase`, `.env`, admin tooling or paid PDFs. With no Supabase configuration, the marketing site and hosted payment links work normally.

After a Vercel Preview is available, check the URLs in `page-urls.md`, `/llh.html`, `/robots.txt`, `/sitemap.xml`, current sample PDFs and all four payment destinations. Check old DA/DS/ML/Combined URLs redirect to their correct views; unknown paths and backend paths should return 404. Verify LLH cache/CSP headers in the response. Run a real Career Resources submission only with an email address you control.

Submit the updated sitemap in the existing Search Console property after production deployment. The sitemap lists only `/` because product views intentionally share the same URL; independent product SEO pages would require a later routing change.

Reference: [Vercel static project configuration](https://vercel.com/docs/project-configuration/vercel-json) and [Vercel upload exclusions](https://vercel.com/docs/deployments/vercel-ignore). The configuration and redirect destinations are locally tested; a Vercel deployment has not been performed by this task.
