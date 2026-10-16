import { setupDialog } from './dialog.js';

const defaultResources = {
  handbook: { title: 'EDA Handbook', file: 'eda-handbook.pdf', label: 'handbook' },
  workbook: { title: 'EDA Practice Workbook', file: 'eda-practice-workbook.pdf', label: 'practice workbook' },
  solutions: { title: 'EDA Solution Manual', file: 'eda-solution-manual.pdf', label: 'solution manual' },
};
let library;
function loadLibrary() {
  library ||= import('../assets/vendor/pdfjs/pdf.min.mjs').then(pdfjs => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('../assets/vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;
    return pdfjs;
  });
  return library;
}

export function setupSampleGallery({ resources = defaultResources } = {}) {
  const section = document.querySelector('#samples');
  const frame = section.querySelector('.sample-frame');
  const slot = section.querySelector('#sample-pdf-page');
  const imageButton = section.querySelector('.sample-image-button');
  const tabs = [...section.querySelectorAll('[data-sample]')];
  const dots = [...section.querySelectorAll('[data-sample-index]')];
  const panel = section.querySelector('#sample-panel');
  const status = section.querySelector('#sample-status');
  const dialog = document.querySelector('#sample-dialog');
  const enlarged = document.querySelector('#sample-enlarged');
  const openLink = document.querySelector('#sample-open-pdf');
  const modal = setupDialog(dialog);
  const documents = new Map();
  let type = 'handbook';
  let pageNumber = 1;
  let totalPages = 32;
  let sequence = 0;
  let modalSequence = 0;
  let started = false;

  function documentFor(selected) {
    if (!documents.has(selected)) {
      const promise = loadLibrary().then(pdfjs => pdfjs.getDocument({
        url: new URL(`../pdfs/${resources[selected].file}`, import.meta.url).href,
        standardFontDataUrl: new URL('../assets/vendor/pdfjs/standard_fonts/', import.meta.url).href,
        cMapUrl: new URL('../assets/vendor/pdfjs/cmaps/', import.meta.url).href,
        cMapPacked: true,
        wasmUrl: new URL('../assets/vendor/pdfjs/wasm/', import.meta.url).href,
        isEvalSupported: false,
      }).promise).catch(error => { documents.delete(selected); throw error; });
      documents.set(selected, promise);
    }
    return documents.get(selected);
  }

  async function pageCanvas(pdf, number, maxWidth, maxHeight, title) {
    const page = await pdf.getPage(number);
    const size = page.getViewport({ scale: 1 });
    const scale = Math.min(maxWidth / size.width, maxHeight / size.height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = page.getViewport({ scale: scale * ratio });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    canvas.style.width = `${Math.floor(size.width * scale)}px`;
    canvas.style.height = `${Math.floor(size.height * scale)}px`;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${title}, page ${number} of ${pdf.numPages}`);
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    return canvas;
  }

  function updateControls() {
    section.querySelector('#sample-subject').textContent = resources[type].subject || 'Exploratory Data Analysis';
    tabs.forEach(tab => {
      const selected = tab.dataset.sample === type;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${type}`);
    section.querySelector('#sample-position').textContent = `${String(pageNumber).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`;
    // Keep the original three-dot design; the window follows the current PDF page.
    const start = Math.max(1, Math.min(pageNumber - 1, totalPages - 2));
    dots.forEach((dot, index) => {
      const number = start + index;
      dot.hidden = number > totalPages;
      dot.dataset.sampleIndex = String(number - 1);
      dot.setAttribute('aria-label', `Show PDF page ${number}`);
      dot.setAttribute('aria-current', String(number === pageNumber));
    });
    imageButton.setAttribute('aria-label', `Read ${resources[type].title}, page ${pageNumber}`);
    section.querySelector('#sample-note').textContent = `An actual page from the LearnLytics EDA ${resources[type].label}.`;
    openLink.href = `pdfs/${resources[type].file}#page=${pageNumber}`;
  }

  async function render() {
    if (!started || !section.isConnected) return;
    const request = ++sequence;
    const selected = type;
    const requestedPage = pageNumber;
    frame.setAttribute('aria-busy', 'true');
    imageButton.disabled = true;
    status.textContent = `Loading ${resources[selected].title}…`;
    if (!slot.querySelector('canvas')) slot.textContent = 'Loading PDF…';
    updateControls();
    try {
      const pdf = await documentFor(selected);
      if (request !== sequence) return;
      totalPages = pdf.numPages;
      pageNumber = Math.min(requestedPage, totalPages);
      const styles = getComputedStyle(frame);
      const width = Math.max(100, frame.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight));
      const height = window.innerWidth >= 980 ? 455 : window.innerWidth >= 560 ? 430 : 365;
      const canvas = await pageCanvas(pdf, pageNumber, Math.min(width, 420), height, resources[selected].title);
      if (request !== sequence || !section.isConnected) return;
      slot.replaceChildren(canvas);
      slot.dataset.pdf = resources[selected].file;
      slot.dataset.page = String(pageNumber);
      updateControls();
      status.textContent = `${resources[selected].title}, page ${pageNumber} of ${totalPages}.`;
    } catch {
      if (request !== sequence) return;
      const fallback = document.createElement('a');
      fallback.href = `pdfs/${resources[selected].file}`;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'Open the PDF ↗';
      slot.replaceChildren(fallback);
      status.textContent = 'Preview unavailable. Open the PDF to read it.';
    } finally {
      if (request === sequence) {
        frame.setAttribute('aria-busy', 'false');
        imageButton.disabled = !slot.querySelector('canvas');
      }
    }
  }

  function selectType(selected) {
    type = selected;
    pageNumber = 1;
    started = true;
    render();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectType(tab.dataset.sample));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectType(tabs[next].dataset.sample);
      tabs[next].focus();
    });
  });
  section.querySelector('.sample-previous').addEventListener('click', () => {
    pageNumber = (pageNumber + totalPages - 2) % totalPages + 1;
    render();
  });
  section.querySelector('.sample-next').addEventListener('click', () => {
    pageNumber = pageNumber % totalPages + 1;
    render();
  });
  dots.forEach(dot => dot.addEventListener('click', () => {
    pageNumber = Number(dot.dataset.sampleIndex) + 1;
    render();
  }));
  imageButton.addEventListener('click', async () => {
    const request = ++modalSequence;
    const selected = type;
    const number = pageNumber;
    document.querySelector('#sample-dialog-title').textContent = resources[selected].title;
    enlarged.textContent = 'Loading PDF…';
    modal.open();
    try {
      const pdf = await documentFor(selected);
      const canvas = await pageCanvas(pdf, number, Math.min(dialog.clientWidth - 40, 850), Math.max(320, innerHeight * 0.72), resources[selected].title);
      if (request === modalSequence && dialog.open) enlarged.replaceChildren(canvas);
    } catch {
      if (request === modalSequence) enlarged.textContent = 'Use Open PDF to read this document.';
    }
  });
  dialog.addEventListener('close', () => { modalSequence++; enlarged.replaceChildren(); });

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      started = true;
      observer.disconnect();
      render();
    }
  }, { rootMargin: '300px' });
  observer.observe(section);
  let lastWidth = 0;
  new ResizeObserver(() => {
    const width = Math.round(frame.clientWidth);
    if (width && width !== lastWidth) { lastWidth = width; render(); }
  }).observe(frame);
  const app = document.querySelector('#app');
  app.addEventListener('learnlytics:view-leave', () => { sequence++; });
  app.addEventListener('learnlytics:view-enter', () => { if (section.isConnected) render(); });
  updateControls();
}
