import { projectToolkits, toolkitLaunchLabel } from './project-da-config.js?v=toolkit-ml-kit-links-20261030';

export function setupProjectToolkit() {
  const page = document.querySelector('[data-project-toolkit]');
  const config = projectToolkits[page.dataset.projectToolkit];
  const pdf = config.freePdfUrl;
  const freeUrl = /^(https:\/\/|\/(?!\/)|\.?\.?\/|pdfs\/)/i.test(pdf) ? pdf : '';

  page.querySelectorAll('[data-project-download]').forEach(link => {
    if (freeUrl) {
      link.href = freeUrl;
      link.removeAttribute('aria-disabled');
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
    }
  });
  page.querySelectorAll('[data-download-status]').forEach(note => { note.hidden = Boolean(freeUrl); });
  page.querySelectorAll('[data-toolkit-launch]').forEach(label => {
    label.textContent = toolkitLaunchLabel(config);
    if (config.launchDate) label.setAttribute('datetime', config.launchDate);
    else label.removeAttribute('datetime');
  });
  // Announce the release without exposing a price or a premature purchase link.
  page.querySelectorAll('[data-project-buy]').forEach(link => {
    link.removeAttribute('href');
    link.setAttribute('aria-disabled', 'true');
    link.textContent = 'Part 02 — Coming soon';
  });
  page.addEventListener('click', event => {
    if (event.target.closest('[aria-disabled="true"]')) event.preventDefault();
  });
}
