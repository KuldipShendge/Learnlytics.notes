// Shared public configuration for the DA and DS Toolkit landing pages.
// Launch dates are announcements, not automatic checkout activation.
export const projectToolkits = {
  analyst: { freePdfUrl: '', launchDate: '2026-11-04' },
  scientist: { freePdfUrl: '', launchDate: '2026-11-12' },
};

export function toolkitLaunchLabel(config) {
  const date = new Date(`${config.launchDate}T00:00:00+05:30`);
  const label = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata',
  }).format(date);
  return `Coming soon on ${label}`;
}
