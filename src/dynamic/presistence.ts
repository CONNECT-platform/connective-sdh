import { Configuration } from 'webpack';

import { Bundle } from './bundle';
import { pack } from './pack';
import { saveMeta, loadMeta } from './meta';


/**
 *
 * Packs and stores given bundle on the file system.
 * Also stores corresponding metadata alongside the bundle.
 *
 * For using your custom programmatic bundler instead of webpack,
 * you can do the following:
 * 
 * ```typescript
 * async function mySaveBundle(bundle: Bundle) {
 *   await packWith(myPackFunc)(bundle);
 *   await saveMeta(bundle);
 * }
 * ```
 *
 * @param bundle
 * @param config web-pack configuration override
 * @returns the given bundle after the process is finished.
 *
 */
export async function saveBundle(bundle: Bundle, config?: Configuration) {
  await pack(bundle, config);
  await saveMeta(bundle);

  return bundle;
}


/**
 *
 * Will load a previously constructed and stored bundle from filesystem.
 *
 * @param path the path to load the bundle from.
 * @param url  the URL that the bundle is to be accessible by clients.
 * @returns the `Bundle` object
 * @throws if the bundle meta data cannot be located.
 *
 */
export async function loadBundle(path: string, url?: string) {
  const bundle = new Bundle(url || path, path);
  const meta = await loadMeta(bundle);

  bundle.imports = meta.components;
  bundle.rendererImport = meta.renderer;
  bundle.initImports = meta.init;
  bundle.repack = false;

  return bundle;
}
