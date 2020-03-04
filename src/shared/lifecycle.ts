export function attachPromise(host: Node, promise: Promise<any>) {
  if (host instanceof DocumentFragment) {
    let marker = getLSMarker(host);
    if (!marker)
      attachPromise(addLSMarker(host), promise);
  }
  else
    ((host as any).__promises = (host as any).__promises || []).push(promise);
}


export function promises(node: Node) {
  let childPromises = <Promise<any>[]>[];
  node.childNodes.forEach(child => childPromises = childPromises.concat(promises(child)));

  return ((node as any).__promises || []).concat(childPromises);
}


export async function isReady(node: Node) {
  await Promise.all(promises(node));
  return true;
}


interface WRCallback {
  cb: () => void;
  priority: number;
}


export const WRCallbackDefaultPriority = 0;
export const WRCallbackHighPriority = 1000;


export function whenRendered(node: Node, cb: () => void, priority = WRCallbackDefaultPriority) {
  if (node instanceof DocumentFragment) {
    let marker = getLSMarker(node);
    if (!marker)
      whenRendered(addLSMarker(node), cb);
  }
  else
    ((node as any).__wr_callbacks = (node as any).__wr_callbacks || []).push({cb, priority});
}


export function itsRendered(node: Node) {
  ((node as any).__wr_callbacks || [])
    .sort((a: WRCallback, b: WRCallback) => b.priority - a.priority)
    .forEach((w: WRCallback) => w.cb());
  node.childNodes.forEach(itsRendered);
}


export function setLSMarker(fragment: DocumentFragment, marker: Node) {
  (fragment as any).__ls_marker = marker;
  if (!fragment.contains(marker))
    fragment.appendChild(marker);
}


export function getLSMarker(fragment: DocumentFragment) {
  return (fragment as any).__ls_marker;
}


export function addLSMarker(fragment: DocumentFragment) {
  const marker = document.createElement('i');
  marker.setAttribute('hidden', '');
  setLSMarker(fragment, marker);

  return marker;
}
