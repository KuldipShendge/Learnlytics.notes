// Native dialogs provide focus trapping and Escape support without a dependency.
export function setupDialog(dialog) {
  let trigger;
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  });
  return {
    open() {
      trigger = document.activeElement;
      dialog.showModal();
      dialog.scrollTop = 0;
    },
    close() {
      dialog.close();
    },
  };
}
