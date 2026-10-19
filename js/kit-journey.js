// Shared purchase-to-learning overview. Colours inherit each page's theme.
const illustrations = {
  purchase: '<rect x="7" y="13" width="50" height="37" rx="7"/><path d="M7 24h50M16 35h13m-13 7h8"/>',
  unlock: '<path class="journey-lock-shackle" d="M20 29V17a12 12 0 0 1 24 0v4"/><rect class="journey-lock-body" x="12" y="27" width="40" height="31" rx="6"/><text class="journey-lock-label" x="32" y="47" text-anchor="middle">LLH</text>',
  download: '<path d="M37 5H15a4 4 0 0 0-4 4v46a4 4 0 0 0 4 4h34a4 4 0 0 0 4-4V21L37 5Zm0 0v16h16M32 29v18m-7-7 7 7 7-7"/>',
  growth: '<path d="M6 57h52"/><path class="journey-bar journey-bar-one" d="M11 42h9v15h-9Z"/><path class="journey-bar journey-bar-two" d="M27 31h9v26h-9Z"/><path class="journey-bar journey-bar-three" d="M43 17h9v40h-9Z"/><path d="M9 29c17-1 27-10 38-22M37 7h10v10"/>',
};
const art = name => `<svg class="journey-art" viewBox="0 0 64 64" aria-hidden="true">${illustrations[name]}</svg>`;
const icon = name => `<svg class="icon" aria-hidden="true"><use href="assets/icons/product.svg#${name}" /></svg>`;

export function setupKitJourney() {
  const section = document.querySelector('[data-kit-journey]');
  if (!section || section.childElementCount) return;
  section.innerHTML = `
    <header class="journey-heading">
      <p class="journey-eyebrow">LEARNLYTICS MEDIA</p>
      <h2 id="kit-journey-title">How It Works <span>&amp; What You Get</span></h2>
      <p>One purchase. Access to <abbr title="LearnLytics Learning Hub">LLH</abbr>, your complete learning kit, and a personal space to track your growth.</p>
    </header>
    <ol class="journey-steps">
      <li class="journey-step">
        <span class="journey-number" aria-hidden="true">01</span>
        ${art('purchase')}
        <h3>Purchase Your Kit</h3>
        <p>Choose your kit and complete a secure payment.</p>
      </li>
      <li class="journey-step journey-step-featured">
        <span class="journey-number" aria-hidden="true">02</span>
        ${art('unlock')}
        <h3>Unlock <abbr title="LearnLytics Learning Hub">LLH</abbr></h3>
        <p>Access your LearnLytics Learning Hub and My Library.</p>
      </li>
      <li class="journey-step">
        <span class="journey-number" aria-hidden="true">03</span>
        ${art('download')}
        <h3>Download Your Kit</h3>
        <p>Get your handbooks, practice workbooks and interview resources.</p>
      </li>
      <li class="journey-step">
        <span class="journey-number" aria-hidden="true">04</span>
        ${art('growth')}
        <h3>Track Your Study &amp; Career</h3>
        <p>Use your Study Tracker and Career Tracker inside LLH.</p>
      </li>
    </ol>
    <ul class="journey-benefits" aria-label="Your learning experience">
      <li>${icon('book')}<span>Complete Learning Resources</span></li>
      <li>${icon('stats')}<span>All Access in <b>LLH</b></span></li>
      <li>${icon('check')}<strong>Download. Learn. Track. Grow.</strong></li>
    </ul>
    <p class="journey-availability">Learning Hub and study &amp; career trackers are coming soon.</p>`;
}
