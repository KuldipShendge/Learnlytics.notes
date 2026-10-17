# Career Resources

The former Free Resources catalog from `D:/website` is now the `resources`
view in the current single-URL site. Home and About navigation replace
“What’s inside” with “Career Resources” and a Free tag. The existing homepage
kit-content section remains available to its other links. Product footers also
link to the resources page.

## Migrated content

The five titles, book covers and Google Drive destinations come from
`D:/website/js/course-catalog.js`, `D:/website/js/script.js` (`openModal`),
and `D:/website/images/light-theme/free-*.webp`. Download/email metadata is in
`js/career-resources-data.js`; the original files are linked, not duplicated
or replaced with the EDA product-preview PDFs.

## Existing Google Sheet integration

The form posts to the same public free-download Apps Script deployment used
by `submitModalForm()` in the old website. It preserves all six URL-encoded
fields: `name`, `email`, `phone`, `fileLink`, `subject`, and `emailTitle`.
It does not use the separate discount or aptitude deployment.

The old free-download Apps Script source and its underlying Sheet ID are not
present in `D:/website`. They remain managed in the existing Google account;
no Sheet or deployment was replaced. A read-only GET reached the deployment
and returned the expected Apps Script “Script function not found: doGet” page.
That confirms reachability, not successful row insertion or email delivery.

The form checks HTTP failures, HTML error pages, and explicit JSON/plain-text
errors before showing the delivery confirmation. It retains inputs on errors, prevents
duplicate clicks, times out after 20 seconds, and ignores stale responses after
closing or leaving the view. Contact details are never saved to local storage.
The original disclosure about requested resources and course updates is shown
before submission. The success screen does not claim that an email was delivered.

## Verification

`tests/career-resources.cjs` intercepts the production endpoint and verifies
all five exact delivery payloads, responsive layouts, invalid inputs, server
and network failures, retry, duplicate prevention, cancellation and history.
Test details never leave the local browser. No production POST or email was
sent. The owner can verify end-to-end Sheet insertion and email delivery by
requesting a resource with their own details on the live website.

## Delivery confirmation update (2026-10-17)

Email and WhatsApp fields have red delivery notes and ask for correct, active
contact details. After an accepted request, the dialog asks the user to check
email or WhatsApp, including spam/promotions. It does not assert delivery has
already occurred. No handbook link or download button is rendered for any of
the five resources. WhatsApp automation has not been verified.

Complete removal of Drive URLs from public JavaScript is pending access to the
existing free-download Apps Script. The legacy request still includes `fileLink`
to preserve its email behavior. Move the resource-ID-to-file mapping into that
backend before removing frontend `fileLink` values and changing the request
contract. Hiding the button does not make those existing frontend URLs private.
