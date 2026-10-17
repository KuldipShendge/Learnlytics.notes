// LearnLytics — Leads + Reviews
// Paste into the existing spreadsheet-bound Apps Script project and redeploy.
// Every resource uses the same folder. Never accept a delivery URL from a form.
var FREE_RESOURCES_FOLDER = 'https://drive.google.com/drive/folders/1dwF8tIv9EWkqO_tVQlSHWxdAAdSlo-li?usp=sharing';
var FREE_RESOURCES_SUBJECT = 'Here is your Free Resources Link — LearnLytics';

function doPost(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('This script must be bound to your spreadsheet.');
    return params.type === 'review' ? handleReview(ss, params) : handleLead(ss, params);
  } catch (error) {
    Logger.log('Form handler error: ' + error.toString());
    return jsonResponse({ result: 'error', error: 'Unable to process your request. Please try again.' });
  }
}

function handleLead(ss, params) {
  var name = String(params.name || '').trim();
  var email = String(params.email || '').trim();
  var phone = String(params.phone || '').trim();
  var digits = phone.replace(/\D/g, '');
  if (!name || name.length > 100 || email.length > 254 ||
      !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(email) ||
      !/^[+\d\s().-]+$/.test(phone) || digits.length < 10 || digits.length > 15) {
    return jsonResponse({ result: 'error', error: 'Please enter your name, a valid email and phone number.' });
  }

  var sheet = ss.getSheetByName('Leads');
  if (!sheet) {
    sheet = ss.insertSheet('Leads');
    // Keep the original five-column layout for existing spreadsheet users.
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'File Link']);
  }
  sheet.appendRow([new Date(), sheetText(name), sheetText(email), sheetText(phone), FREE_RESOURCES_FOLDER]);

  try {
    var message = buildFreeResourcesEmail(name);
    GmailApp.sendEmail(email, FREE_RESOURCES_SUBJECT, message.text, {
      htmlBody: message.html,
      name: 'LearnLytics',
      replyTo: 'learnlytics.handbook@gmail.com'
    });
  } catch (mailError) {
    Logger.log('Free resources email error: ' + mailError.toString());
    // The lead is saved, but the browser must not claim the email was sent.
    return jsonResponse({ result: 'error', type: 'lead', leadSaved: true,
      emailSent: false, error: 'Your details were saved, but the email could not be sent. Please try again or contact us.' });
  }
  // Gmail accepted the send request; this is not proof of inbox delivery.
  return jsonResponse({ result: 'success', type: 'lead', emailSent: true });
}

function buildFreeResourcesEmail(name) {
  var text = 'Hi ' + name + '!\n\n' +
    'Here is your Free Resources Link:\n' + FREE_RESOURCES_FOLDER + '\n\n' +
    'Explore our collection of free handbooks and download whichever resources match your learning goals. ' +
    'You can return to the same folder whenever you want to explore another topic.\n\n' +
    'Happy learning!\nTeam LearnLytics\nlearnlytics.handbook@gmail.com';
  var html = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:28px;background:#f2f5ff;border-radius:16px">' +
    '<h1 style="color:#0b123f;font-size:24px;text-align:center;margin:0 0 24px">LearnLytics</h1>' +
    '<div style="background:#fff;padding:28px;border:1px solid #dfe5f3;border-radius:12px">' +
    '<h2 style="color:#0b123f;font-size:20px;margin-top:0">Hi ' + escapeEmailHtml(name) + '!</h2>' +
    '<p style="color:#0b123f;font-size:18px;font-weight:bold">Here is your Free Resources Link.</p>' +
    '<p style="color:#4e5b7d;font-size:15px;line-height:1.7">Explore our collection of free handbooks and download whichever resources match your learning goals.</p>' +
    '<p style="margin:28px 0"><a href="' + FREE_RESOURCES_FOLDER + '" style="display:inline-block;background:#0758e8;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Open Free Resources</a></p>' +
    '<p style="color:#4e5b7d;font-size:14px;line-height:1.7">You can return to the same folder whenever you want to explore another topic.</p>' +
    '<p style="color:#4e5b7d;font-size:14px;line-height:1.7">Happy learning!<br>Team LearnLytics</p></div>' +
    '<p style="text-align:center;color:#4e5b7d;font-size:12px;margin-top:24px">Need help? Reply to this email or contact learnlytics.handbook@gmail.com.</p></div>';
  return { text: text, html: html };
}

function handleReview(ss, params) {
  var sheet = ss.getSheetByName('Reviews');
  if (!sheet) {
    sheet = ss.insertSheet('Reviews');
    sheet.appendRow(['Timestamp', 'Name', 'Rating', 'Review']);
  }
  sheet.appendRow([new Date(), sheetText(params.name || ''),
    sheetText(params.rating || '5'), sheetText(params.review || '')]);
  return jsonResponse({ result: 'success', type: 'review' });
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function escapeEmailHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
  });
}

function sheetText(value) {
  var text = String(value);
  // Keep submitted text literal instead of allowing spreadsheet formulas.
  return /^[=+\-@\t\r\n]/.test(text) ? "'" + text : text;
}

// Read-only setup check. This does not send an email or add rows.
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open this script from the destination spreadsheet.');
  Logger.log('Sheet name: ' + ss.getName());
  Logger.log('Sheets: ' + ss.getSheets().map(function (sheet) { return sheet.getName(); }).join(', '));
  Logger.log('Setup looks good. Deploy a new version to activate the updated handler.');
}
