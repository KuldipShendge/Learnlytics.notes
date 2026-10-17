const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('google-apps-script/form-handler.gs', 'utf8');
const sheets = new Map(), messages = [];
let failMail = false;
const spreadsheet = {
  getSheetByName: name => sheets.get(name),
  insertSheet(name) {
    const sheet = { rows: [], appendRow(row) { this.rows.push(row); } };
    sheets.set(name, sheet); return sheet;
  }
};
const context = vm.createContext({
  SpreadsheetApp: { getActiveSpreadsheet: () => spreadsheet },
  GmailApp: { sendEmail(...args) { if (failMail) throw Error('quota failure'); messages.push(args); } },
  Logger: { log() {} },
  ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput(text) {
    return { text, setMimeType() { return this; } };
  } }
});
vm.runInContext(source, context);
const submit = params => JSON.parse(context.doPost({ parameter: params }).text);
const lead = { name: 'Reader <b>Test</b>', email: 'reader@example.test', phone: '+91 9000000000' };
const folder = context.FREE_RESOURCES_FOLDER;
for (const resourceId of ['analytics-ground-zero', 'sql-handbook', 'ds-handbook', 'eda-part01', 'big-data']) {
  const result = submit({ ...lead, resourceId, fileLink: 'https://example.test/untrusted', subject: 'Untrusted title', emailTitle: 'Untrusted title' });
  assert.equal(result.result, 'success');
  assert.equal(result.emailSent, true);
  const [recipient, subject, text, options] = messages.at(-1);
  assert.equal(recipient, lead.email);
  assert.equal(subject, 'Here is your Free Resources Link — LearnLytics');
  assert(text.includes(folder) && options.htmlBody.includes(folder));
  assert(!text.includes(resourceId) && !options.htmlBody.includes('Untrusted'));
  assert(options.htmlBody.includes('Reader &lt;b&gt;Test&lt;/b&gt;'));
  assert(!options.htmlBody.includes('https://example.test/untrusted'));
  assert.equal(sheets.get('Leads').rows.at(-1)[4], folder);
  assert.equal(sheets.get('Leads').rows.at(-1)[3], "'+91 9000000000");
}
assert.equal(sheets.get('Leads').rows.length, 6, 'Header plus five leads');
assert.equal(new Set(messages.map(message => message[2])).size, 1, 'Identical email for every card');
for (const invalid of [{ email: 'invalid' }, { email: 'a@example.test,b@example.test' }, { name: '' }, { phone: 'invalid' }]) {
  assert.equal(submit({ ...lead, ...invalid }).result, 'error');
}
assert.equal(messages.length, 5);
assert.equal(sheets.get('Leads').rows.length, 6);
failMail = true;
const failed = submit(lead);
assert.equal(failed.result, 'error');
assert.equal(failed.emailSent, false);
assert.equal(failed.leadSaved, true);
assert.equal(sheets.get('Leads').rows.length, 7);
assert.equal(submit({ type: 'review', name: '=1+1', rating: '4', review: 'Helpful material' }).type, 'review');
assert.equal(sheets.get('Reviews').rows[1][1], "'=1+1");
assert.equal(sheets.get('Reviews').rows[1][2], '4');
assert.equal(messages.length, 5, 'Reviews do not send mail');
assert.equal(submit({}).result, 'error');
console.log('PASS: common folder/email for all five cards; ignored client destinations; lead rows, validation, HTML escaping, mail failure and review compatibility. All Google services mocked.');
