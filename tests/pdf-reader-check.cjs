const assert = require('node:assert/strict');

module.exports = async function checkPdfReader(page, { filename, count, start = 1 }) {
  await page.locator('.sample-image-button').click();
  const reader = page.locator('#sample-enlarged');
  const pageAt = number => reader.locator(`.pdf-reader-page[data-page="${number}"]`);
  await pageAt(start).locator('canvas').waitFor();
  assert.equal(await reader.locator('.pdf-reader-page').count(), count);
  assert.equal(await page.locator('[data-reader-page] option').count(), count);
  assert.equal(await page.locator('[data-reader-page]').inputValue(), String(start));
  assert.match(await page.locator('#sample-open-pdf').getAttribute('href'), new RegExp(`${filename}#page=${start}$`));

  // Reading is continuous: a scroll reveals later pages and updates the controls.
  await reader.evaluate(el => el.scrollTo({ top: el.scrollHeight, behavior: 'instant' }));
  await pageAt(count).locator('canvas').waitFor();
  await page.waitForFunction(count => document.querySelector('[data-reader-page]').value === String(count), count);
  assert(await page.locator('[data-reader-next]').isDisabled());
  assert.match(await page.locator('#sample-open-pdf').getAttribute('href'), new RegExp(`#page=${count}$`));

  await page.locator('[data-reader-page]').selectOption('1');
  await pageAt(1).locator('canvas').waitFor();
  assert(await page.locator('[data-reader-previous]').isDisabled());
  await page.locator('[data-reader-next]').click();
  await pageAt(2).locator('canvas').waitFor();
  assert.equal(await page.locator('[data-reader-page]').inputValue(), '2');
  await page.locator('[data-reader-previous]').click();
  assert.equal(await page.locator('[data-reader-page]').inputValue(), '1');
  assert(await reader.evaluate(el => el.scrollWidth <= el.clientWidth + 1));
  // Distant pages release their bitmaps instead of keeping a whole book in memory.
  assert(await reader.locator('canvas').count() < count);
  assert.equal(await page.locator('#sample-open-pdf').getAttribute('target'), '_blank');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#sample-dialog').open && document.querySelector('#sample-enlarged').childElementCount === 0);
  assert(await page.locator('.sample-image-button').evaluate(el => el === document.activeElement));
};
