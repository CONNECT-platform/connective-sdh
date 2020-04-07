export function onReady(callback: () => any) {
  if (document.readyState != 'loading') {
    setTimeout(callback, 1);
  } else {
    window.addEventListener('DOMContentLoaded', callback);
  }
}
