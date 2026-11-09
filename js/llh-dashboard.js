import { escapeHtml } from './llh-auth-utils.js';
import { sampleProgress, dashboardFeatures } from './llh-dashboard-data.js';

const paths = {
  overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  tools: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  library: '<path d="M3 4h6v16H3zM9 6h5v14H9zM15 5l4-1 3 15-4 1zM5 8h2M11 10h1"/>',
  study: '<rect x="4" y="4" width="16" height="17" rx="3"/><path d="M8 2v4m8-4v4M8 11h8m-8 4h4m3 2 2 2 4-4"/>',
  interview: '<path d="M20 11a8 8 0 0 1-8 8H5l-3 3v-9a9 9 0 0 1 9-9h1M17 2v6m-3-3h6M7 11h7m-7 4h4"/>',
  career: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  lock: '<rect x="6" y="10" width="12" height="11" rx="2"/><path d="M9 10V6a3 3 0 0 1 6 0v4m-3 4v3"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  logout: '<path d="M9 4H4v16h5m4-8h8m-4-4 4 4-4 4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
};
const icon = name => `<svg class="dash-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;

export function mountDashboard({ displayName = 'Learner', onLogout }) {
  const root = document.createElement('div');
  root.className = 'llh-dashboard';
  root.id = 'llh-dashboard';
  const name = escapeHtml(displayName);
  const initial = escapeHtml(Array.from(displayName.trim())[0] || 'L');
  const completed = sampleProgress.chaptersCompleted;
  const total = sampleProgress.chaptersTotal;
  const percent = Math.round(completed / total * 100);
  const activeDays = sampleProgress.activity.filter(day => day.minutes > 0).length;
  const totalMinutes = sampleProgress.activity.reduce((sum, day) => sum + day.minutes, 0);
  const maxMinutes = Math.max(1, ...sampleProgress.activity.map(day => day.minutes));
  root.innerHTML = `
    <aside class="dash-sidebar" aria-label="Workspace navigation">
      <a class="dash-brand" href="./" aria-label="LearnLytics home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>LearnLytics<small>LEARNING HUB</small></span></a>
      <div class="dash-nav-group"><p class="dash-nav-label">YOUR WORKSPACE</p><nav class="dash-nav" aria-label="Dashboard">
        <a href="#dashboard-main" aria-current="location" title="Overview">${icon('overview')}<span>Overview</span><i></i></a>
        <a href="#dashboard-tools" title="Learning tools">${icon('tools')}<span>Learning tools</span><i></i></a>
      </nav></div>
      <div class="dash-sidebar-bottom"><div class="dash-side-note"><span class="dash-preview-dot"></span><strong>A space to grow.</strong><p>One chapter. One small win.<br />At your own pace.</p></div><a class="dash-website" href="./" title="Back to website">${icon('arrow')}<span>Back to website</span></a></div>
    </aside>
    <div class="dash-workspace">
      <header class="dash-topbar"><div class="dash-breadcrumb"><span>Learning Hub</span><span aria-hidden="true">/</span><strong>Overview</strong></div><div class="dash-account">
        <button class="dash-account-toggle" type="button" aria-expanded="false" aria-controls="dash-account-panel" aria-label="Account options"><span class="dash-avatar" aria-hidden="true">${initial}</span><span class="dash-account-name">${name}<small>Signed in</small></span>${icon('chevron')}</button>
        <div id="dash-account-panel" class="dash-account-panel" hidden><strong>${name}</strong><p>Verified email session</p><a class="dash-account-website" href="./">Back to website ${icon('arrow')}</a><button class="dash-logout" type="button">${icon('logout')}Logout</button><p class="dash-account-error" role="alert"></p></div>
      </div></header>
      <main class="dash-main" id="dashboard-main" tabindex="-1">
        <section class="dash-welcome" aria-labelledby="dash-title"><p class="dash-eyebrow">MAKE ROOM FOR YOUR NEXT CHAPTER</p><h1 id="dash-title">Welcome back, ${name}<span>.</span></h1><p>A little focus today. A stronger foundation tomorrow.</p></section>
        <div class="dash-preview-note">${icon('info')}<p><strong>Sample data</strong><span>Progress below is illustrative. Your activity isn’t being saved.</span></p></div>
        <section class="dash-overview" aria-labelledby="dash-progress-heading">
          <div class="dash-section-heading"><h2 id="dash-progress-heading">Your learning at a glance</h2><span>SMALL STEPS, REAL POTENTIAL</span></div>
          <div class="dash-progress-grid">
            <article class="dash-progress-card"><div class="dash-progress-copy"><span class="dash-card-kicker">STUDY COMPLETION</span><h3>You’re building<br />something good.</h3><p><strong>${completed}</strong> of ${total} chapters complete</p><div class="dash-progress-legend"><span>${icon('check')}${completed} completed</span><span><i></i>${total - completed} remaining</span></div></div>
              <div class="dash-ring" role="img" aria-label="Sample study completion: ${percent} percent; ${completed} of ${total} chapters"><svg viewBox="0 0 160 160" aria-hidden="true"><circle class="dash-ring-track" cx="80" cy="80" r="67"/><circle class="dash-ring-fill" cx="80" cy="80" r="67" pathLength="100" stroke-dasharray="${percent} 100"/></svg><div><strong>${percent}<span>%</span></strong><small>completed</small></div></div>
              <p class="dash-progress-caption">Your pace. Your progress. One chapter at a time.</p>
            </article>
            <article class="dash-activity-card"><div class="dash-activity-heading"><div><span class="dash-card-kicker">LEARNING ACTIVITY</span><h3>${activeDays}<span>of 7 days active</span></h3></div><span class="dash-week-label">Sample week</span></div>
              <div class="dash-activity-chart" role="group" aria-label="Explore sample study minutes by day">${sampleProgress.activity.map((day, index) => `<button class="dash-day" type="button" data-day="${index}" aria-pressed="false" aria-label="${day.day}: ${day.minutes} sample minutes"><span class="dash-day-value">${day.minutes || '—'}</span><span class="dash-bar-track"><svg viewBox="0 0 32 80" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="${80 - Math.max(3, day.minutes / maxMinutes * 80)}" width="32" height="${Math.max(3, day.minutes / maxMinutes * 80)}" rx="4" class="${day.minutes ? 'dash-bar-active' : 'dash-bar-empty'}"/></svg></span><span class="dash-day-label">${day.day.slice(0,3)}</span></button>`).join('')}</div>
              <div class="dash-activity-caption">${icon('clock')}<p id="dash-activity-detail" role="status" aria-live="polite">${totalMinutes} sample minutes this week</p><button type="button" class="dash-activity-reset" hidden aria-label="Show weekly activity total">Reset</button></div>
            </article>
          </div>
        </section>
        <section class="dash-tools" id="dashboard-tools" tabindex="-1" aria-labelledby="dash-tools-heading"><div class="dash-section-heading"><div><h2 id="dash-tools-heading">A place for every next step</h2><p>Your learning toolkit, taking shape.</p></div><span class="dash-tools-label">4 LEARNING TOOLS</span></div>
          <div class="dash-feature-grid">${dashboardFeatures.map((feature, index) => `<article class="dash-feature dash-feature-${feature.accent}" aria-labelledby="feature-${feature.id}"><div class="dash-feature-top"><span class="dash-feature-icon">${icon(feature.icon)}</span><span class="dash-feature-number" aria-hidden="true">0${index + 1}</span></div><span class="dash-card-kicker">${feature.label}</span><h3 id="feature-${feature.id}">${feature.title}</h3><p>${feature.description}</p><div class="dash-feature-footer"><span class="dash-feature-status"><i></i>${feature.status}</span><button type="button" disabled aria-label="${feature.title}: not available yet">${icon('lock')}Not available yet</button></div></article>`).join('')}</div>
        </section>
        <footer class="dash-footer"><span>LearnLytics Learning Hub</span><span>A little progress goes a long way.</span></footer>
      </main>
    </div>`;
  document.body.append(root);
  document.title = 'Dashboard | LearnLytics Learning Hub';

  const toggle = root.querySelector('.dash-account-toggle');
  const account = root.querySelector('.dash-account');
  const panel = root.querySelector('.dash-account-panel');
  const close = () => { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) panel.querySelector('.dash-logout').focus();
  });
  const outside = event => { if (!account.contains(event.target)) close(); };
  const escape = event => { if (event.key === 'Escape' && !panel.hidden) { close(); toggle.focus(); } };
  account.addEventListener('focusout', event => { if (!account.contains(event.relatedTarget)) close(); });
  document.addEventListener('click', outside);
  document.addEventListener('keydown', escape);
  root.querySelector('.dash-logout').addEventListener('click', async event => {
    event.currentTarget.disabled = true;
    try { await onLogout(); }
    catch { panel.querySelector('[role="alert"]').textContent = 'Unable to sign out. Please try again.'; root.querySelector('.dash-logout').disabled = false; }
  });

  // Chart selection explores mock data only; it never writes study progress.
  const days = root.querySelectorAll('.dash-day');
  const detail = root.querySelector('#dash-activity-detail');
  const reset = root.querySelector('.dash-activity-reset');
  days.forEach(button => button.addEventListener('click', () => {
    const day = sampleProgress.activity[Number(button.dataset.day)];
    days.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    detail.textContent = `${day.day} · ${day.minutes} sample minutes${day.minutes === 0 ? ' · Rest day' : ''}`;
    reset.hidden = false;
  }));
  reset.addEventListener('click', () => {
    const selected = root.querySelector('.dash-day[aria-pressed="true"]');
    days.forEach(button => button.setAttribute('aria-pressed', 'false'));
    detail.textContent = `${totalMinutes} sample minutes this week`;
    reset.hidden = true;
    selected?.focus();
  });

  const links = root.querySelectorAll('.dash-nav a');
  const tools = root.querySelector('#dashboard-tools');
  function setCurrent(target) {
    links.forEach(link => link.getAttribute('href') === target ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
    root.querySelector('.dash-breadcrumb strong').textContent = target === '#dashboard-tools' ? 'Learning tools' : 'Overview';
  }
  let scrollFrame = 0;
  const onScroll = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      const atBottom = scrollY > 0 && Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2;
      setCurrent(atBottom || tools.getBoundingClientRect().top <= Math.max(160, innerHeight * .35) ? '#dashboard-tools' : '#dashboard-main');
      scrollFrame = 0;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  links.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const target = link.getAttribute('href');
    const section = root.querySelector(target);
    section.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    section.focus({ preventScroll: true });
    setCurrent(target);
  }));
  root.querySelector('main').focus({ preventScroll: true });
  window.scrollTo(0, 0);
  return () => {
    document.removeEventListener('click', outside);
    document.removeEventListener('keydown', escape);
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(scrollFrame);
    root.remove();
  };
}
