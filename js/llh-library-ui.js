import { escapeHtml } from './llh-auth-utils.js';

// Shared presentation only. Authentication and access decisions stay with the caller.
export function libraryCards(kits) {
  return kits.map(kit => `<article class="llh-kit ${kit.accessible ? '' : 'is-locked'}">
      <span class="llh-kit-status">${kit.accessible ? 'In your library' : 'Locked'}</span>
      <h3>${escapeHtml(kit.name)}</h3><p>${escapeHtml(kit.description)}</p>
      ${kit.accessible ? (kit.resources.length ? `<ul class="llh-resource-list">${kit.resources.map(resource => `<li><strong>${escapeHtml(resource.title)}</strong><small>${escapeHtml(resource.format)}${resource.size_bytes ? ` · ${(resource.size_bytes / 1048576).toFixed(1)} MB` : ''}</small><button type="button" data-resource-id="${escapeHtml(resource.id)}">Open resource</button></li>`).join('')}</ul>` : '<p class="llh-unavailable">Your kit access is active. Resource delivery will appear here once enabled.</p>') : '<p class="llh-unavailable">This kit is not included in your current access.</p>'}
    </article>`).join('');
}
