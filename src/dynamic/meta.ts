import { parse, join } from 'path';
import { writeFile, readFile } from 'rxline/fs';

import { Bundle } from './bundle';
import { TransportInfo, leanInfo } from './transport/transport-info';


/**
 *
 * Denotes the metadata of a bundle
 *
 */
export interface BundleMeta {
  /**
   * 
   * The renderer used for the bundle's components.
   * 
   */
  renderer?: TransportInfo,

  /**
   * 
   * Init scripts that will execute upon bundle being loaded in client-side.
   * 
   */
  init: TransportInfo[],

  /**
   * 
   * Components included in the bundle.
   * 
   */
  components: TransportInfo[],
}


/**
 *
 * @param bundle
 * @returns the standard address of the meta file for given bundle.
 * @note that the address might not correspond to an actual file on the filesystem. This
 * can happen if the bundle has never been saved to the filesystem with its current path,
 * storing its meta data was omitted from its saving process, or the metadata file was lost
 * afterwards.
 *
 */
export function metafile(bundle: Bundle) {
  const { dir, name } = parse(bundle.path);
  return join(dir, name + '.meta.json');
}


/**
 *
 * Saves the meta data of given bundle to filesystem. This meta data contains
 * info about which transport components does the bundle contain and is useful
 * for subsequent reloading the bundle from filesystem.
 *
 * @param bundle
 * @returns a `rxline` file corresponding to the stored meta data file.
 *
 */
export function saveMeta(bundle: Bundle) {
  const meta: BundleMeta = {
    init: bundle.initImports.map(leanInfo),
    components: bundle.imports.map(leanInfo),
  };

  if (bundle.rendererImport)
    meta.renderer = leanInfo(bundle.rendererImport);

  return writeFile()({
    path: metafile(bundle),
    root: '',
    content: JSON.stringify(meta, undefined, 2)
  });
}


/**
 *
 * @param bundle 
 * @returns the stored metadata of the given bundle.
 * @throws if the metadata file cannot be found.
 * @see metafile()
 *
 */
export async function loadMeta(bundle: Bundle): Promise<BundleMeta> {
  return JSON.parse((await readFile()({
      path: metafile(bundle),
      root: '',
      content: undefined
    })).content);
}
