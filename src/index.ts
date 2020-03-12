export * from './shared';
export * from './static';
export * from './dynamic';


import { saveCompiledFile, Compiled } from './static';
import { saveBundle, Bundle} from './dynamic';
import { Function } from 'rxline';
import { File } from 'rxline/fs';


export function save(): Function<File<Compiled>, File<string>>;
export function save(bundle: Bundle): Promise<Bundle>;
export function save(bundle?: Bundle) {
  if (bundle) return saveBundle(bundle);
  else return saveCompiledFile();
}

export { loadBundle as load } from './dynamic';
