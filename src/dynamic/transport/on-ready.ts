export function onReady(callback: () => any) {
  if (document.readyState === 'interactive') {
    setTimeout(callback, 1);
  } else {
    window.addEventListener('DOMContentLoaded', callback);
  }
}
