const assert = require('node:assert/strict');
module.exports = async function checkPaymentLink(page, id, selector = '.purchase-button') {
 const link = page.locator(selector);
 assert.equal(await link.evaluate(el=>el.tagName),'A');
 assert.equal(await link.getAttribute('href'),`https://rzp.io/rzp/${id}`);
 assert.equal(await link.getAttribute('target'),'_blank');
 assert.match(await link.getAttribute('rel'),/\bnoopener\b/);
};
