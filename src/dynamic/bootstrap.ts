import { join, parse } from 'path';

import { createEntry } from './create-entry';
import { Bundle } from './bundle';


export async function bootstrap(bundle: Bundle) {
  const { dir, name } = parse(bundle.path);
  const entryPath = join(dir, name + '.entry.js');
  await createEntry(entryPath, bundle.imports, bundle.rendererImport);

  return entryPath;
}
