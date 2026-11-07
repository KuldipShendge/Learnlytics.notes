import { escapeHtml } from './llh-auth-utils.js';
import { sampleProgress, dashboardFeatures } from './llh-dashboard-data.js';

const paths = {
  overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  tools: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  library: '<path d="M4 4h6v16H4zM10 6h5v14h-5zM16 5l4-1 3 15-4 1zM6 8h2M12 10h1"/>',
  study: '<rect x="4" y="4" width="16" height="17" rx="3"/><path d="M8 2v4m8-4v4M8 11h8m-8 4h4m3 2 2 2 4-4"/>',
  interview: '<path d="M20 11a8 8 0 0 1-8 8H5l-3 3v-9a9 9 0 0 1 9-9h1M17 2v6m-3-3h6M7 11h7m-7 4h4"/>',
  career: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  lock: '<rect x="6" y="10" width="12" height="11" rx="2"/><path d="M9 10V6a3 3 0 0 1 6 0v4m-3 4v3"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  logout: '<path d="M9 4H4v16h5m4-8h8m-4-4 4 4-4 4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
};
const icon = name => `<svg class="dash-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;

export function mountDashboard({ displayName = 'Learner', onLogout }) {
  const root = document.createElement('div');
  root.className = 'llh-dashboard';
  root.id = 'llh-dashboard';
  const name = escapeHtml(displayName);
  const completed = sampleProgress.chaptersCompleted;
  const total = sampleProgress.chaptersTotal;
  const percent = Math.round(completed / total * 100);
  const activeDays = sampleProgress.activity.filter(day => day.minutes > 0).length;
  root.innerHTML = `
    <aside class="dash-sidebar" aria-label="Workspace navigation">
      <a class="dash-brand" href="./" aria-label="LearnLytics home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>LearnLytics<small>LEARNING HUB</small></span></a>
      <p class="dash-nav-label">WORKSPACE</p>
      <nav class="dash-nav" aria-label="Dashboard"><a href="#dashboard-main" aria-current="page">${icon('overview')}<span>Overview</span><span class="dash-current-dot"></span></a><a href="#dashboard-tools">${icon('tools')}<span>Learning tools</span></a></nav>
      <div class="dash-sidebar-bottom"><div class="dash-side-note"><span class="dash-small-spark" aria-hidden="true">✳</span><p>Small steps.<br /><strong>Lasting progress.</strong></p></div><a class="dash-website" href="./">Back to website ${icon('arrow')}</a></div>
    </aside>
    <div class="dash-workspace">
      <header class="dash-topbar"><div class="dash-breadcrumb"><span>Workspace</span><span aria-hidden="true">/</span><strong>Overview</strong></div><div class="dash-account"><button class="dash-account-toggle" type="button" aria-expanded="false" aria-controls="dash-account-panel" aria-label="Account options"><span class="dash-avatar" aria-hidden="true">L</span><span class="dash-account-name">${name}<small>Local demo account</small></span>${icon('chevron')}</button><div id="dash-account-panel" class="dash-account-panel" hidden><strong>${name}</strong><p>Temporary local session</p><button class="dash-logout" type="button">${icon('logout')}Logout</button><p class="dash-account-error" role="alert"></p></div></div></header>
      <main class="dash-main" id="dashboard-main" tabindex="-1">
        <section class="dash-welcome" aria-labelledby="dash-title"><div><p class="dash-eyebrow">A LITTLE PROGRESS, EVERY DAY</p><h1 id="dash-title">Welcome back, ${name}<span>.</span></h1><p>Your space to learn with focus and move forward with confidence.</p></div><span class="dash-workspace-tag"><i></i>Your learning workspace</span></section>
        <div class="dash-preview-note"><span class="dash-preview-pill">Sample data</span><p>This is a preview of your workspace. Progress is illustrative and isn’t saved.</p></div>
        <section class="dash-overview" aria-labelledby="dash-progress-heading">
          <div class="dash-section-heading"><h2 id="dash-progress-heading">A little closer to your goals</h2><span>PROGRESS OVERVIEW</span></div>
          <div class="dash-progress-grid">
            <article class="dash-progress-card"><div class="dash-ring" role="img" aria-label="Sample study completion: ${percent} percent; ${completed} of ${total} chapters"><svg viewBox="0 0 140 140" aria-hidden="true"><circle class="dash-ring-track" cx="70" cy="70" r="59"/><circle class="dash-ring-fill" cx="70" cy="70" r="59" pathLength="100" stroke-dasharray="${percent} 100"/></svg><div><strong>${percent}<span>%</span></strong><small>completed</small></div></div><div class="dash-progress-copy"><span class="dash-card-kicker">YOUR STUDY JOURNEY</span><h3>Every chapter counts.</h3><p><strong>${completed}</strong> of ${total} chapters completed</p><div class="dash-progress-legend"><span>${icon('check')}Completed</span><span><i></i>${total - completed} to explore</span></div></div></article>
            <article class="dash-activity-card"><div class="dash-activity-heading"><div><span class="dash-card-kicker">LEARNING RHYTHM</span><h3>${activeDays} <span>active days</span></h3></div><span class="dash-week-label">Sample week</span></div><ol class="dash-activity-chart" aria-label="Illustrative study minutes by weekday">${sampleProgress.activity.map(day => `<li aria-label="${day.day}: ${day.minutes} sample minutes"><div class="dash-bar-track"><svg viewBox="0 0 32 80" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="${80 - Math.max(4, day.minutes * 2)}" width="32" height="${Math.max(4, day.minutes * 2)}" rx="5" class="${day.minutes ? 'dash-bar-active' : 'dash-bar-empty'}"/></svg></div><span>${day.short}</span></li>`).join('')}</ol><p class="dash-activity-caption">A steady rhythm makes room for growth.</p></article>
          </div>
        </section>
        <section class="dash-tools" id="dashboard-tools" tabindex="-1" aria-labelledby="dash-tools-heading"><div class="dash-section-heading"><div><h2 id="dash-tools-heading">Your next step starts here</h2><p>Four ways to make your preparation feel more connected.</p></div></div><div class="dash-feature-grid">${dashboardFeatures.map(feature => `<article class="dash-feature dash-feature-${feature.accent}" aria-labelledby="feature-${feature.id}"><div class="dash-feature-top"><span class="dash-feature-icon">${icon(feature.icon)}</span><span class="dash-feature-status">${feature.status}</span></div><span class="dash-card-kicker">${feature.label}</span><h3 id="feature-${feature.id}">${feature.title}</h3><p>${feature.description}</p><div class="dash-feature-footer"><button type="button" disabled aria-describedby="feature-${feature.id}">${icon('lock')}${feature.status === 'Coming soon' ? 'Coming soon' : 'Not available yet'}</button><span class="dash-feature-arrow" aria-hidden="true">${icon('arrow')}</span></div></article>`).join('')}</div></section>
        <footer class="dash-footer"><span>LearnLytics Learning Hub</span><span>Built for your next chapter.</span></footer>
      </main>
    </div>`;
  document.body.append(root);
  document.title = 'Dashboard | LearnLytics Learning Hub';
  const toggle = root.querySelector('.dash-account-toggle');
  const panel = root.querySelector('.dash-account-panel');
  const close = () => { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) panel.querySelector('button').focus();
  });
  const outside = event => { if (!root.querySelector('.dash-account').contains(event.target)) close(); };
  const escape = event => { if (event.key === 'Escape' && !panel.hidden) { close(); toggle.focus(); } };
  document.addEventListener('click', outside);
  document.addEventListener('keydown', escape);
  root.querySelector('.dash-logout').addEventListener('click', async event => {
    event.currentTarget.disabled = true;
    try { await onLogout(); }
    catch { panel.querySelector('[role="alert"]').textContent = 'Unable to sign out. Please try again.'; root.querySelector('.dash-logout').disabled = false; }
  });
  // In-page navigation only; do not create feature routes or write browser history.
  root.querySelectorAll('.dash-nav a').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const section = root.querySelector(link.getAttribute('href'));
    section.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    section.focus({ preventScroll: true });
  }));
  root.querySelector('main').focus({ preventScroll: true });
  window.scrollTo(0, 0);
  return () => {
    document.removeEventListener('click', outside);
    document.removeEventListener('keydown', escape);
    root.remove();
  };
}
