# Career Resources delivery

## Google Apps Script update

`google-apps-script/form-handler.gs` is the complete replacement for the
spreadsheet-bound Leads + Reviews handler supplied by the owner.

1. Open the existing destination Google Sheet, then Extensions > Apps Script.
2. Replace the existing handler with the contents of `form-handler.gs`. Avoid
   leaving duplicate doPost/handleLead/handleReview functions in other files.
3. Save, then Deploy > Manage deployments > select the existing web app > Edit.
4. Select New version, then Deploy. Keep its existing web-app URL and access
   settings so the website endpoint continues to work. Authorize if prompted.
5. Submit with your own email from Career Resources and check the Leads row,
   email and folder access. The read-only testSetup function only checks the
   bound spreadsheet; it does not send an email or verify delivery.

Google deployment instructions:
https://developers.google.com/apps-script/concepts/deployments

Saving/pushing this repository does not deploy the Google Apps Script project.
The handler has been tested with mocked Google services, not real email sends.

## One common email

Subject: Here is your Free Resources Link — LearnLytics

Hi [Name]!

Here is your Free Resources Link:
[The configured free-resources folder]

Explore our collection of free handbooks and download whichever resources match
your learning goals. You can return to the same folder whenever you want to
explore another topic.

Happy learning!
Team LearnLytics

Both HTML and plain-text email versions use the same folder configured once in
FREE_RESOURCES_FOLDER. No handbook-specific title or claims about paid bundles
are included. Client-supplied fileLink, subject and emailTitle are ignored.
The Gmail API accepting the message does not prove inbox delivery.

## Website contract

The browser posts name, email, phone and resourceId to the same existing
Apps Script endpoint. resourceId identifies the selected card but does not
change the email or require any file mapping. The server ignores it for delivery.

The Leads sheet retains Timestamp / Name / Email / Phone / File Link; the last
column now stores the common folder. Reviews retain their existing columns and
routing. Input text is escaped for email HTML and stored literally in the sheet.

If sending fails, the saved lead remains and the server returns result:error,
leadSaved:true and emailSent:false. A retry may create another lead row. The
website shows an error instead of claiming success. Tests use mocked services.

Email has a red delivery note; phone asks for an active WhatsApp number. No
WhatsApp delivery or phone verification is implemented or promised. Successful
requests show Check your Email with no download button or direct folder link.

## Source and publishing

The folder URL exists only in the server handler, not in website HTML or browser
JavaScript. The Pages workflow excludes google-apps-script from its artifact.
This source remains visible in the Git repository; it is not a secret or access
control. Old URLs in Git history and the D:/website reference are unchanged.

## Checks

- node tests/form-handler.cjs: shared email, all resource selections, ignored
  client URLs/titles, validation, saved leads, mail failure and reviews.
- node tests/career-resources.cjs: responsive form, exact browser payloads,
  no download links, field notes, error handling, cancellation and navigation.
