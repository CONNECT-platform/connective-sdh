import { Configuration } from 'webpack';

import { webPack } from './webpack';
import { Bundle } from './bundle';
import { bootstrap } from './bootstrap';


/**
 *
 * Packs given bundle using **WebPack**.
 *
 * @param bundle
 * @param config Webpack configuration to be used.
 *
 */
export async function pack(bundle: Bundle, config?: Configuration) {
  return packWith((entry, output) => webPack(entry, output, config))(bundle);
}


/**
 *
 * Denotes a function that packs a client side bundle using
 * given entry file, and stores it at given output path.
 *
 */
export type PackFunc = (entry: string, output: string) => Promise<any>;


/**
 *
 * Returns a function that packs given bundle using given `PackFunc`.
 * Useful for using custom programmatic bundlers.
 *
 * @param packer
 *
 */
export function packWith(packer: PackFunc) {
  return async function (bundle: Bundle) {
    if (bundle.repack)
      return packer(await bootstrap(bundle), bundle.path);
  }
}
