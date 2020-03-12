import { Bundle } from './bundle';
import { pack } from './pack';
import { saveMeta, loadMeta } from './meta';


export async function saveBundle(bundle: Bundle) {
  await pack(bundle);
  await saveMeta(bundle);

  return bundle;
}


export async function loadBundle(path: string, url?: string) {
  const bundle = new Bundle(url || path, path);
  bundle.imports = await loadMeta(bundle);
  bundle.repack = false;

  return bundle;
}
