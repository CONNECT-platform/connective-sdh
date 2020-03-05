import { createHash } from 'crypto';
import { getLSMarker } from '../shared/lifecycle';


export interface TransportInfo {
  name: string;
  filename: string;
  hash: string;
  resolved: boolean,
}


function hash(x: string) {
  return createHash('md5').update(x).digest('base64').toString();
}


export function createInfo(name: string, trace: NodeJS.CallSite): TransportInfo {
  const filename = trace.getFileName() || '';
  return { name, filename, hash: hash(filename + '::' + name), resolved: false };
}


export function attachInfo(node: Node, info: TransportInfo) {
  if (node instanceof DocumentFragment)
    attachInfo(getLSMarker(node), info);
  else
    (node as any).__transport_info = info;
}


export function fetchInfo(node: Node): TransportInfo[] {
  if (node instanceof DocumentFragment) return fetchInfo(getLSMarker(node));
  else {
    let res: TransportInfo[] = [];

    const info = (node as any).__transport_info;
    if (info) res.push(info);
    node.childNodes.forEach(child => res = res.concat(fetchInfo(child)));

    return res;
  }
}
