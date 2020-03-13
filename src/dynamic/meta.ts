import { parse, join } from 'path';
import { writeFile, readFile } from 'rxline/fs';

import { Bundle } from './bundle';
import { TransportInfo } from './transport-info';


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
  return writeFile()({
    path: metafile(bundle),
    root: '',
    content: JSON.stringify(bundle.imports.map(({hash, name, filename}) => ({ hash, name, filename })), undefined, 2)
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
export async function loadMeta(bundle: Bundle): Promise<TransportInfo[]> {
  return JSON.parse((await readFile()({
      path: metafile(bundle),
      root: '',
      content: undefined
    })).content);
}
