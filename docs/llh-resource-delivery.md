# Protected resource delivery decision

Recommendation: approve **private Supabase Storage** for the first delivery implementation, subject to measuring the actual paid catalog. It fits the existing Auth/database/Edge Function integration and avoids a second identity system. No paid file migration or bucket creation has happened.

## Size evidence

The current repository contains the three explicitly public EDA samples: handbook 5,638,018 bytes, workbook 470,464 bytes and solutions 1,902,796 bytes (about 7.64 MiB total). These are not an inventory of the paid kits. Before selecting a paid plan, measure every paid file, the largest file, total stored versions and expected monthly downloads. Do not infer full-kit sizes from these samples.

## Options

| Option | Access control | Cost and operational implications |
|---|---|---|
| Restricted Google Drive | Private files plus explicit per-customer reader permissions; an “anyone with link” URL is not protected by LLH | Existing account/Workspace capacity may already cover storage, but plan cost and quotas depend on the owner's subscription. Requires permission provisioning/revocation, Google identity handling and download/quota support. |
| Private Supabase Storage | Private bucket; service checks verified user and entitlement before signing a short-lived object URL | Existing Supabase stack; simplest initial integration. Storage and download bandwidth count toward plan allowances. |
| Private Cloudflare R2 | Private bucket plus an authenticated server/Worker signer checking Supabase entitlements | Potentially cheaper high-volume downloads, but adds a signing service, storage credentials, monitoring and a new delivery adapter. Current implementation does not support R2 yet. |

Drive supports user-specific permissions; LLH email verification alone does not create those permissions. Returning a permanent public Drive link after login allows anyone who receives it to bypass LLH. A restricted Drive integration would need separate Google permissions or a server streaming proxy; neither is implemented. See [Google Drive sharing permissions](https://developers.google.com/workspace/drive/api/guides/manage-sharing).

Pricing checked 20 October 2026, USD before taxes and optional services:

- Supabase Free: 1 GB storage, 5 GB uncached plus 5 GB cached egress. Pro starts at $25/month including the first project, 100 GB storage and 250 GB each of uncached/cached egress. Overage is $0.0213/GB storage, $0.09/GB uncached egress and $0.03/GB cached egress. SMTP may add cost. [Supabase pricing](https://supabase.com/pricing)
- Free projects limit individual files to 50 MB. Pro can configure a larger limit, up to 500 GB; select the appropriate upload method and reasonable bucket limits for actual files. [Storage file limits](https://supabase.com/docs/guides/storage/uploads/file-limits)
- R2 Standard: $0.015/GB-month, with 10 GB-month free; egress is free. Included monthly operations are 1 million Class A and 10 million Class B, then $4.50/million and $0.36/million respectively. Signing Workers or other connected services may add charges. [R2 pricing](https://developers.cloudflare.com/r2/pricing/)

Estimate monthly bandwidth as average GB downloaded per customer × customers × repeat-download factor. For example, a hypothetical 0.2 GB kit downloaded once by 1,000 customers is about 200 GB, before retries. This is an example, not a measurement or a cost quote.

## Approval boundary and implementation

Keep `LLH_DELIVERY_ENABLED=false` until the storage method and file inventory are approved. For Supabase, later create a private `llh-paid` bucket with no direct customer read policy. Store object paths only in `llh_private.kit_resources`; never in the public catalog, Git assets or browser configuration.

Every request supplies only a resource ID. The function obtains the user from Supabase Auth, checks confirmed identity and current grants, resolves the private location server-side, then signs for 60 seconds. Revocation prevents new links. Existing signed links work until expiry, and downloaded files can still be redistributed; this is access control, not DRM.

For later R2 or Drive support, add a dedicated backend adapter and corresponding tests. Do not enable a generic client-supplied URL redirect or loosen URL checks to accommodate them.
