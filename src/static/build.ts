import { File } from 'rxline/fs';
import { Function } from 'rxline';

import { Compiled, PostProcessor } from './compiled';
import { StaticRenderer } from './renderer';
import { compile } from './compile';


/**
 * 
 * Denotes a function that builds an HTML document (or Node) based on some other
 * input.
 * 
 */
export type BuildFunc<T> = (t: T, renderer: StaticRenderer, document: Document) => Node | Promise<Node>;


/**
 * 
 * Convenience function for rxline files. Returns a transform that converts the content 
 * of an rxline `File<T>` using the given `BuildFunc<T>` to a file whose content 
 * is a compiled document.
 * 
 * @param builder
 * 
 */
export function build<T>(builder: BuildFunc<T>): Function<File<T>, File<Compiled>> {
  return function(f: File<T>) {
    return {
      ...f,
      content: compile((renderer, document) => builder(f.content, renderer, document))
    };
  }
}


/**
 * 
 * Convenience function for rxline files. Returns a transform that queues the 
 * given `PostProcessor` function to be applied on contents of given file, 
 * assuming the contents are some compiled document model.
 * 
 * @param processor
 * 
 */
export function post(processor: PostProcessor): Function<File<Compiled>, File<Compiled>> {
  return function(f: File<Compiled>) {
    f.content.post(processor);
    return f;
  }
}


/**
 * 
 * Convenience function for rxline files. Returns a transform that serializes
 * contents of given file, assuming the contents are some compiled document model.
 * 
 */
export function serialize(): Function<File<Compiled>, File<string>> {
  return async function(f: File<Compiled>) {
    return {
      ...f,
      content: await f.content.serialize()
    }
  }
}


/**
 * 
 * Convenience function for rxline files. Returns a transform that
 * saves the contents of the given file, assuming the contents are some
 * compiled document model, to the address of the file itself.
 * 
 */
export function saveCompiledFile(): Function<File<Compiled>, File<string>> {
  return async function(f: File<Compiled>) {
    return f.content.save(f.path, f.root);
  }
}
