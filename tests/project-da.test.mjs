import test from 'node:test';
import assert from 'node:assert/strict';
import { projectDAConfig, projectDAOffer } from '../js/project-da-config.js';

test('offer spans exactly ten IST calendar days and expires at midnight November 9', () => {
  assert.equal(Date.parse(projectDAConfig.offerEnd) - Date.parse(projectDAConfig.offerStart), 10 * 86400000);
  for (const [date, price, active] of [
    ['2026-10-29T23:59:59.999+05:30', 499, false],
    ['2026-10-30T00:00:00+05:30', 199, true],
    ['2026-11-08T23:59:59.999+05:30', 199, true],
    ['2026-11-09T00:00:00+05:30', 499, false],
  ]) assert.deepEqual(projectDAOffer(Date.parse(date)), { active, price, checkoutUrl: '' });
});

test('checkout follows the current amount without falling back to expired discounts', () => {
  const config = structuredClone(projectDAConfig);
  // Test-only destinations: never included in the production configuration.
  config.checkout.offer.url = 'https://payments.example.test/offer';
  config.checkout.regular.url = 'https://payments.example.test/regular';
  const active = Date.parse(config.offerStart);
  const expired = Date.parse(config.offerEnd);
  assert.equal(projectDAOffer(active, config).checkoutUrl, config.checkout.offer.url);
  assert.equal(projectDAOffer(expired, config).checkoutUrl, config.checkout.regular.url);
  config.checkout.regular.url = '';
  assert.equal(projectDAOffer(expired, config).checkoutUrl, '');
  config.checkout.offer.amount = 499;
  assert.equal(projectDAOffer(active, config).checkoutUrl, '');
  config.checkout.offer.amount = 199;
  config.checkout.offer.url = 'javascript:alert(1)';
  assert.equal(projectDAOffer(active, config).checkoutUrl, '');
});
