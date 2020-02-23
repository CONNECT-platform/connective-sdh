export function attachPromise(host: Node, promise: Promise<any>) {
  if (!(host as any)._promises) (host as any)._promises = [];
  (host as any)._promises.push(promise);
}


export function promises(node: Node) {
  let childPromises = <Promise<any>[]>[];
  node.childNodes.forEach(child => childPromises = childPromises.concat(promises(child)));

  return ((node as any)._promises || []).concat(childPromises);
}


export async function isReady(node: Node) {
  await Promise.all(promises(node));
  return true;
}
