import { videos } from './video-config.js?v=guides-20261015';

export function setupInlineVideos() {
  const app = document.querySelector('#app');
  const slots = [...app.querySelectorAll('[data-inline-video]')];

  function load(slot, autoplay = false, muted = false) {
    const video = videos[slot.dataset.inlineVideo];
    if (!video?.youtubeId) return;
    const iframe = document.createElement('iframe');
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      playsinline: '1',
      rel: '0',
    });
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?${params}`;
    iframe.title = video.title;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    // The first guide must load immediately for autoplay on a fresh visit.
    iframe.loading = autoplay ? 'eager' : 'lazy';
    slot.replaceChildren(iframe);
    return iframe;
  }

  function mount() {
    slots.filter(slot => slot.isConnected && !slot.querySelector('iframe')).forEach(slot => {
      const autoplay = slot.hasAttribute('data-autoplay');
      load(slot, autoplay, autoplay);
    });
  }

  app.querySelectorAll('[data-video]').forEach(button => {
    button.addEventListener('click', () => {
      const slot = slots.find(item => item.dataset.inlineVideo === button.dataset.video);
      if (!slot) return;
      // Starting a guide from its card stops the other player first.
      slots.filter(item => item !== slot).forEach(item => load(item));
      const iframe = load(slot, true);
      slot.scrollIntoView({ block: 'center', behavior: 'instant' });
      iframe?.focus({ preventScroll: true });
    });
  });

  // Remove browsing contexts on view changes; revisiting starts muted again.
  app.addEventListener('learnlytics:view-leave', () => {
    slots.filter(slot => slot.isConnected).forEach(slot => slot.replaceChildren());
  });
  app.addEventListener('learnlytics:view-enter', mount);
  mount();
}
