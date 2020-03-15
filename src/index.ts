import { Configuration } from 'webpack';

export * from './shared';
export * from './static';
export * from './dynamic';


import { saveCompiledFile, Compiled } from './static';
import { saveBundle, Bundle} from './dynamic';
import { Function } from 'rxline';
import { File } from 'rxline/fs';


/**
 * 
 * Convenience function for rxline files. Returns a transform that
 * saves the contents of the given file, assuming the contents are some
 * compiled document model, to the address of the file itself.
 * 
 */
export function save(): Function<File<Compiled>, File<string>>;

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
export function save(bundle: Bundle, config?: Configuration): Promise<Bundle>;
export function save(bundle?: Bundle, config?: Configuration) {
  if (bundle) return saveBundle(bundle, config);
  else return saveCompiledFile();
}

export { loadBundle as load } from './dynamic';
