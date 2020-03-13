import { Bundle } from './bundle';
import { pack } from './pack';
import { saveMeta, loadMeta } from './meta';


/**
 *
 * Packs and stores given bundle on the file system.
 * Also stores corresponding metadata alongside the bundle.
 *
 * This function uses **Webpack** with default configurations.
 * For using custom configurations, you can instead do the following:
 * 
 * ```typescript
 * async function mySaveBundle(bundle: Bundle) {
 *   await pack(bundle, myConfiguration);
 *   await saveMeta(bundle);
 * }
 * ```
 *
 * Similarly for using your custom programmatic bundler instead of webpack,
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
 * @returns the given bundle after the process is finished.
 *
 */
export async function saveBundle(bundle: Bundle) {
  await pack(bundle);
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
  bundle.imports = await loadMeta(bundle);
  bundle.repack = false;

  return bundle;
}
