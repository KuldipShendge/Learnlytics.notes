import { setupDialog } from './dialog.js';

// Keep every page in the scrollable document, but rasterize only nearby pages.
export function setupPdfReader({ dialog, container, openLink, documentFor, pageCanvas, resources }) {
  const modal = setupDialog(dialog);
  const select = dialog.querySelector('[data-reader-page]');
  const previous = dialog.querySelector('[data-reader-previous]');
  const next = dialog.querySelector('[data-reader-next]');
  const status = dialog.querySelector('[data-reader-status]');
  let session = 0;
  let observer;
  let pages = [];
  let current = 1;
  let file;
  let scrollFrame;

  function updatePosition(number) {
    current = number;
    select.value = String(number);
    previous.disabled = number <= 1;
    next.disabled = number >= pages.length;
    openLink.href = `pdfs/${file}#page=${number}`;
  }

  function goTo(number) {
    const page = pages[number - 1];
    if (!page) return;
    container.scrollTo({ top: page.element.offsetTop - 12, behavior: 'instant' });
    updatePosition(number);
  }
  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  select.addEventListener('change', () => goTo(Number(select.value)));
  container.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      if (pages.length && container.scrollTop + container.clientHeight >= container.scrollHeight - 2) {
        updatePosition(pages.length);
        return;
      }
      const readingLine = container.getBoundingClientRect().top + Math.min(120, container.clientHeight / 3);
      const page = pages.find(page => page.element.getBoundingClientRect().bottom > readingLine);
      if (page) updatePosition(page.number);
    });
  }, { passive: true });

  function clear() {
    session++;
    observer?.disconnect();
    cancelAnimationFrame(scrollFrame);
    // Release high-resolution canvas memory on close and view changes.
    container.querySelectorAll('canvas').forEach(canvas => { canvas.width = canvas.height = 0; });
    container.replaceChildren();
    pages = [];
  }
  dialog.addEventListener('close', clear);

  async function open(selected, number) {
    clear();
    const request = session;
    file = resources[selected].file;
    dialog.querySelector('#sample-dialog-title').textContent = resources[selected].title;
    select.replaceChildren();
    select.disabled = previous.disabled = next.disabled = true;
    status.textContent = 'Loading PDF…';
    container.textContent = 'Loading PDF…';
    openLink.href = `pdfs/${file}#page=${number}`;
    modal.open();
    try {
      const pdf = await documentFor(selected);
      const sizes = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) =>
        (await pdf.getPage(index + 1)).getViewport({ scale: 1 })));
      if (request !== session || !dialog.open) return;
      container.replaceChildren();
      pages = sizes.map((size, index) => {
        const element = document.createElement('figure');
        element.className = 'pdf-reader-page';
        element.dataset.page = String(index + 1);
        const slot = document.createElement('div');
        slot.className = 'pdf-reader-canvas';
        slot.style.aspectRatio = `${size.width} / ${size.height}`;
        slot.textContent = 'Loading page…';
        const caption = document.createElement('figcaption');
        caption.textContent = `Page ${index + 1} of ${pdf.numPages}`;
        element.append(slot, caption);
        container.append(element);
        select.add(new Option(`${index + 1} / ${pdf.numPages}`, String(index + 1)));
        return { element, slot, number: index + 1, near: false, rendered: false, pending: false };
      });
      select.disabled = false;
      status.textContent = `${pdf.numPages} pages · Scroll to read the full PDF`;
      goTo(Math.min(number, pdf.numPages));
      const readerPages = pages;
      const queue = [];
      let running = 0;
      function pump() {
        if (request !== session) return;
        while (running < 2 && queue.length) {
          const page = queue.shift();
          page.pending = false;
          if (!page.near || page.rendered) continue;
          running++;
          page.rendered = true;
          pageCanvas(pdf, page.number, Math.min(page.slot.clientWidth, 850), Infinity, resources[selected].title)
            .then(canvas => {
              if (request !== session || !dialog.open || !page.near) {
                canvas.width = canvas.height = 0;
                page.rendered = false;
                return;
              }
              canvas.style.width = '100%';
              canvas.style.height = 'auto';
              page.slot.replaceChildren(canvas);
            })
            .catch(() => {
              if (request === session) page.slot.textContent = 'Page preview unavailable. Use Open PDF below.';
            })
            .finally(() => { running--; pump(); });
        }
      }
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const page = readerPages[Number(entry.target.dataset.page) - 1];
          page.near = entry.isIntersecting;
          if (page.near && !page.rendered && !page.pending) {
            page.pending = true;
            queue.push(page);
          } else if (!page.near && page.slot.querySelector('canvas')) {
            const canvas = page.slot.querySelector('canvas');
            canvas.width = canvas.height = 0;
            page.slot.textContent = 'Loading page…';
            page.rendered = false;
          }
        }
        pump();
      }, { root: container, rootMargin: '500px 0px' });
      pages.forEach(page => observer.observe(page.element));
    } catch {
      if (request !== session) return;
      container.textContent = 'Use Open PDF below to read this document.';
      status.textContent = 'PDF preview unavailable';
    }
  }
  return { open, close() { if (dialog.open) modal.close(); else clear(); } };
}
