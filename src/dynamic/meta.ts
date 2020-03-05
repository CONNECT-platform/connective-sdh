import { parse, join } from 'path';
import { writeFile, readFile } from 'rxline/fs';

import { Bundle } from './bundle';
import { TransportInfo } from './transport-info';


export function metafile(bundle: Bundle) {
  const { dir, name } = parse(bundle.path);
  return join(dir, name + '.meta.json');
}


export function saveMeta(bundle: Bundle) {
  return writeFile()({
    path: metafile(bundle),
    root: '',
    content: JSON.stringify(bundle.imports.map(({hash, name, filename}) => ({ hash, name, filename })), undefined, 2)
  });
}


export async function loadMeta(bundle: Bundle): Promise<TransportInfo[]> {
  return JSON.parse((await readFile()({
      path: metafile(bundle),
      root: '',
      content: undefined
    })).content);
}
