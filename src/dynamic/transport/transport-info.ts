import { sep } from 'path';
import { createHash } from 'crypto';
import { getLSMarker } from '../../shared/lifecycle';


/**
 *
 * Denotes necessary server-side import information
 * for transporting some code to the client.
 *
 */
export interface TransportInfo {
  /**
   *
   * Name of the artifact to be imported.
   *
   */
  name: string;

  /**
   *
   * The file from which the artifact is to be imported from.
   *
   */
  filename: string;

  /**
   *
   * A hash for identifying the transported artifact without leaking
   * server filesystem information to the client side.
   *
   */
  hash: string;

  /**
   *
   * Whether or not this particular dependency is yet resolved by any
   * bundle.
   *
   */
  resolved?: boolean,
}


function hash(x: string) {
  return createHash ? createHash('md5').update(x).digest('base64').toString() : '';
}


/**
 *
 * @param name
 * @param trace
 * @returns a `TransportInfo` based on given artifact name and given NodeJS trace.
 *
 */
export function createInfo(name: string, trace: NodeJS.CallSite): TransportInfo {
  const filename = (trace.getFileName() || '').split(sep || '/').join('/');
  return { name, filename, hash: hash(filename + '::' + name), resolved: false };
}


/**
 *
 * Attaches given `TransportInfo` to given `Node`.
 *
 * @param node
 * @param info
 *
 */
export function attachInfo(node: Node, info: TransportInfo) {
  if (node instanceof DocumentFragment)
    attachInfo(getLSMarker(node), info);
  else
    (node as any).__transport_info = info;
}


/**
 *
 * @param node
 * @returns all attached `TransportInfo` on given `Node`
 *
 */
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


/**
 *
 * @param info
 * @returns a lean version of the transport info, omitting runtime-data.
 *
 */
export function leanInfo(info: TransportInfo): TransportInfo {
  return {
    name: info.name,
    filename: info.filename,
    hash: info.hash
  }
}
