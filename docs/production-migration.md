# Move the current site to learnlytics.handbook

Prepared 20 October 2026 using the old `D:\website` deployment files. The existing production domain in those files is **https://learnlyticshandbook.shop/**. No changes to that domain, its DNS, the target repository or the Vercel project have been made.

## Included for the move

| File | Purpose |
|---|---|
| `vercel.json` | Static framework, pinned install command, Vercel build, `dist` output, security/cache headers and explicit old-link redirects |
| `.vercelignore` | Excludes local demo, backend, credentials, tests, logs and other non-build inputs from CLI upload |
| `scripts/build-vercel.mjs` | Runs the existing allowlisted build; fails if an obsolete root `api/` directory is present |
| `deployment/public-files.json` | Exact files allowed in the public artifact, including current images, fonts, video covers, PDF.js and three public EDA sample PDFs |
| `sitemap.xml` | Current canonical homepage only, reflecting the existing single-URL design |
| `robots.txt` | Sitemap location and crawl rules; excludes account/resources paths from indexing |
| `index.html` metadata | Existing Search Console verification, canonical domain, current Open Graph/Twitter metadata and basic Organization JSON-LD |
| `.env.example` | Optional public Supabase configuration names; no secrets required for the marketing site |
| `js/legacy-entry.js`, `js/views.js` | Old external kit/resource/review links open the appropriate current view, then return the address bar to the single base URL |

Current images, logos, local fonts, technology icons, video covers and PDF viewer dependencies are already in this repository. Preserve their filenames and capitalization. The allowlist prevents unrelated old PDFs, source files and local logo copies from appearing in the public site.

The old catch-all rewrite was deliberately not copied. Unknown paths should be real 404s, not copies of the homepage with broken relative assets. Known old kit URLs have explicit permanent redirects; their temporary fragments select the matching view and are then removed. Normal site navigation remains on one URL.

The old `/aptitude-kit` and `/all-handbook-page/de` pages have no equivalent in this redesigned site and are not in the new sitemap or redirect table. Restoring those products is a separate content task.

## Transfer steps

1. Back up the old `learnlytics.handbook` repository and its Vercel project settings. Keep the target repository's `.git` history.
2. Transfer the current tracked source from `Learnlytics.notes` as a **clean replacement**, not an overlay onto the old website. Include hidden files such as `.vercelignore`, `.gitignore` and `.env.example`, plus `package.json`, `pnpm-lock.yaml`, `scripts`, `deployment`, `assets`, `css`, `js`, the HTML files, `robots.txt` and `sitemap.xml`.
3. Remove legacy website code from the target checkout that is not part of this replacement, particularly old `api/`, `server/`, old `vercel.json` rewrite rules and old build configuration. Do not delete the target's `.git` or personal backups. A leftover `api/` causes the new Vercel build to fail intentionally.
4. Do **not** transfer `.env` secrets, `.vercel` project bindings, `.git` from this repository, `node_modules`, generated `dist`, preview logs or personal files. Supabase SQL/docs may remain in the private source workflow, but they are excluded from deployment output.
5. Run the checks below before pushing the target repo. The existing GitHub Pages workflow is restricted to `KuldipShendge/Learnlytics.notes`; copying it to `learnlytics.handbook` will not start another Pages deployment. You can omit it from the Vercel-only target.
6. In the existing Vercel project, keep the correct Git connection to `learnlytics.handbook`. Set Root Directory to the directory containing this `vercel.json`, Framework Preset **Other**, Node **24.x**, build command `node scripts/build-vercel.mjs`, output directory **dist**, and install command `pnpm install --frozen-lockfile --ignore-scripts`. The tracked config supplies these commands/output settings.
7. Inspect a Vercel Preview before promoting Production. Use Vercel deployment protection for previews. Check the supplied domain's configuration in the existing project; do not change DNS merely because the source code changed.

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

After a Vercel Preview is available, check `/`, `/llh.html`, `/robots.txt`, `/sitemap.xml`, current sample PDFs and all four payment destinations. Check old DA/DS/ML/Combined URLs redirect to their correct views; unknown paths and backend paths should return 404. Verify LLH cache/CSP headers in the response. Run a real Career Resources submission only with an email address you control.

Submit the updated sitemap in the existing Search Console property after production deployment. The sitemap lists only `/` because product views intentionally share the same URL; independent product SEO pages would require a later routing change.

Reference: [Vercel static project configuration](https://vercel.com/docs/project-configuration/vercel-json) and [Vercel upload exclusions](https://vercel.com/docs/deployments/vercel-ignore). The configuration and redirect destinations are locally tested; a Vercel deployment has not been performed by this task.
