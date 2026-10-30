// Public frontend configuration. Supply only real, verified delivery/payment URLs.
export const projectDAConfig = {
  freePdfUrl: '',
  regularPrice: 499,
  offerPrice: 199,
  offerStart: '2026-10-30T00:00:00+05:30',
  // Exclusive boundary: includes all of November 8 through 11:59:59 PM IST.
  offerEnd: '2026-11-09T00:00:00+05:30',
  // Existing hosted payment links, each verified to charge its stated INR amount.
  // Leave blank until configured; never reuse the full DA Kit payment link.
  checkout: {
    offer: { url: '', amount: 199 },
    regular: { url: '', amount: 499 },
  },
};

export function projectDAOffer(now = Date.now(), config = projectDAConfig) {
  const active = now >= Date.parse(config.offerStart) && now < Date.parse(config.offerEnd);
  const price = active ? config.offerPrice : config.regularPrice;
  const checkout = config.checkout[active ? 'offer' : 'regular'];
  // An expired offer must never fall back to the discounted payment destination.
  const checkoutUrl = checkout?.amount === price && /^https:\/\//i.test(checkout.url)
    ? checkout.url : '';
  return { active, price, checkoutUrl };
}
