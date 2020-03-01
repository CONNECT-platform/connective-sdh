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
  const _P = promises(node);
  console.log(`>> waiting for ${_P.length} promises`);
  await Promise.all(_P);
  console.log('>> DONE!');
  return true;
}


export function whenRendered(node: Node, cb: () => void) {
  if (node instanceof DocumentFragment) {
    let marker = getLSMarker(node);
    if (!marker)
      whenRendered(addLSMarker(node), cb);
  }
  else
    ((node as any).__wr_callbacks = (node as any).__wr_callbacks || []).push(cb);
}


export function isRendered(node: Node) {
  ((node as any).__wr_callbacks || []).forEach((cb: () => void) => cb());
  node.childNodes.forEach(isRendered);
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
