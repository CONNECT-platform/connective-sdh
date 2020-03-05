import { Bundle } from './bundle';
import { pack } from './pack';
import { saveMeta, loadMeta } from './meta';


export async function save(bundle: Bundle) {
  await pack(bundle);
  await saveMeta(bundle);
}


export async function load(path: string, url?: string) {
  const bundle = new Bundle(url || path, path);
  bundle.imports = await loadMeta(bundle);
  bundle.repack = false;

  return bundle;
}
