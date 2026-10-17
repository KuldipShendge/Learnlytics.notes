# Career Resources

Five free resources migrated from D:/website are available through the
single-URL resources view. Home/About navigation replaces What's inside with
Career Resources and a Free tag; product footers also link here.

## Delivery contract — updated 2026-10-17

The form posts URL-encoded fields to the existing free-download Apps Script:

- name
- email
- phone
- resourceId
- subject
- emailTitle

No Drive destination or fileLink is present in the public catalog or request.
The owner explicitly requested removal and will update the Apps Script.
That backend must resolve resourceId to the correct file and send the email;
its source is not available in this repository. Until that deployment is
updated, end-to-end delivery is not confirmed and may not work.

Resource IDs for the backend mapping:

| resourceId | Resource |
| --- | --- |
| analytics-ground-zero | Analytics — Ground Zero |
| sql-handbook | SQL 250+ Interview Questions |
| ds-handbook | Machine Learning Handbook (Part 1) |
| eda-part01 | Exploratory Data Analysis Part-01 |
| big-data | Big Data Management & Analytics |

Email has a red delivery note; phone asks for an active WhatsApp number.
No WhatsApp delivery is implemented or promised. Accepted requests show
Check your Email, with a spam/promotions reminder and no download link/button.
Contact details are not stored locally. Existing disclosure remains visible.

## Verification

The browser test intercepts external requests: no real lead or email is sent.
It verifies all five request payloads, no file URL in catalog or request,
no download button, red field notes, mobile/desktop layouts, validation,
errors/retry, duplicate prevention, cancellation, focus and history.

## Migration scope

Drive URLs were removed from the current source, not from previous Git commits.
The original D:/website reference is unchanged. No history rewrite or file
sharing permission change was requested.
