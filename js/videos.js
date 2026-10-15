import { setupDialog } from './dialog.js';
import { videos } from './video-config.js?v=guides-20261015';

export function setupVideos() {
  const dialog = document.querySelector('#video-dialog');
  const modal = setupDialog(dialog);
  const player = document.querySelector('#video-player');
  const mode = document.querySelector('#video-mode');
  const disclaimer = document.querySelector('#video-disclaimer');
  let timer;

  function stopPlayback() {
    clearInterval(timer);
    timer = undefined;
  }
  dialog.addEventListener('close', () => {
    stopPlayback();
    player.replaceChildren();
  });

  function loadDemo(video) {
    let step = 0;
    player.innerHTML = `<div class="demo-stage" aria-live="polite"><span class="demo-step-count"></span><h3></h3><p></p></div>
      <div class="demo-progress" aria-hidden="true">${video.steps.map(() => '<span></span>').join('')}</div>
      <div class="demo-controls"><button class="button" type="button" id="demo-play">Play demo</button><div><button class="icon-button" type="button" id="demo-prev" aria-label="Previous demo step">←</button><button class="icon-button" type="button" id="demo-next" aria-label="Next demo step">→</button></div></div>`;
    const play = player.querySelector('#demo-play');
    const previous = player.querySelector('#demo-prev');
    const next = player.querySelector('#demo-next');
    function render() {
      player.querySelector('.demo-step-count').textContent = `STEP ${step + 1} OF ${video.steps.length}`;
      player.querySelector('h3').textContent = video.steps[step].title;
      player.querySelector('.demo-stage p').textContent = video.steps[step].copy;
      player
        .querySelectorAll('.demo-progress span')
        .forEach((item, index) => item.classList.toggle('is-current', index === step));
      previous.disabled = step === 0;
      next.disabled = step === video.steps.length - 1;
    }
    function pause() {
      stopPlayback();
      play.textContent = 'Play demo';
    }
    previous.addEventListener('click', () => {
      pause();
      step--;
      render();
    });
    next.addEventListener('click', () => {
      pause();
      step++;
      render();
    });
    play.addEventListener('click', () => {
      if (timer) {
        pause();
        return;
      }
      if (step === video.steps.length - 1) {
        step = 0;
        render();
      }
      play.textContent = 'Pause demo';
      timer = setInterval(() => {
        if (step === video.steps.length - 1) {
          pause();
          return;
        }
        step++;
        render();
      }, 6000);
    });
    render();
  }

  document.querySelectorAll('[data-video]').forEach((button) => {
    button.addEventListener('click', () => {
      const video = videos[button.dataset.video];
      if (!video) return;
      stopPlayback();
      document.querySelector('#video-dialog-title').textContent = video.title;
      const isVideoReady = /^[a-zA-Z0-9_-]{11}$/.test(video.youtubeId || '');
      mode.textContent = isVideoReady ? 'LEARNLYTICS GUIDE' : 'GUIDE DEMO';
      if (isVideoReady) {
        const iframe = document.createElement('iframe');
        iframe.className = 'youtube-player';
        iframe.src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`;
        iframe.title = video.title;
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        player.replaceChildren(iframe);
        const youtubeLink = document.createElement('a');
        youtubeLink.href = `https://youtu.be/${video.youtubeId}`;
        youtubeLink.target = '_blank';
        youtubeLink.rel = 'noopener noreferrer';
        youtubeLink.className = 'text-button';
        youtubeLink.textContent = 'Watch on YouTube ↗';
        disclaimer.replaceChildren(youtubeLink);
      } else {
        disclaimer.textContent = 'A short interactive demo. The full guide video is coming soon.';
        loadDemo(video);
      }
      modal.open();
    });
  });
}
