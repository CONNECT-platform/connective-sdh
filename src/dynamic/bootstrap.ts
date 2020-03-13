import { join, parse } from 'path';

import { createEntry } from './create-entry';
import { Bundle } from './bundle';


/**
 *
 * Creates the entry file for given bundle. The entry file will contain all necessary
 * imports and initialization code. You can, among other use cases, use this function
 * to create an entry file for given bundle and then use your own bundler to properly
 * construct the bundle file.
 *
 * @param bundle
 * @returns the address of the created bundle entry file.
 *
 */
export async function bootstrap(bundle: Bundle) {
  const { dir, name } = parse(bundle.path);
  const entryPath = join(dir, name + '.entry.js');
  await createEntry(entryPath, bundle.imports, bundle.rendererImport);

  return entryPath;
}
