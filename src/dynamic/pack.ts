import { Configuration } from 'webpack';

import { webPack } from './webpack';
import { Bundle } from './bundle';
import { bootstrap } from './bootstrap';


export async function pack(bundle: Bundle, config?: Configuration) {
  return packWith((entry, output) => webPack(entry, output, config))(bundle);
}


export type PackFunc = (entry: string, output: string) => Promise<any>;


export function packWith(packer: PackFunc) {
  return async function (bundle: Bundle) {
    if (bundle.repack)
      return packer(await bootstrap(bundle), bundle.path);
  }
}
