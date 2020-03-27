import { File } from 'rxline/fs';
import { Function } from 'rxline';

import { Compiled, PostProcessor } from './compiled';
import { StaticRenderer } from './renderer';
import { compile } from './compile';
import { Plugin } from '@connectv/html';


/**
 * 
 * Denotes a function that builds an HTML document (or Node) based on some other
 * input.
 * 
 */
export type BuildFunc<T> = (t: T, renderer: StaticRenderer, file: File<T>, document: Document) => Node | Promise<Node>;

/**
 * 
 * Denotes a function that builds a renderer plugin based on given file. The plugin will be plugged
 * into the renderer that is subsequently used to render an HTML document from the file content.
 * 
 */
export type PluginBuilder<T, R=any, Tag=any> = (f: File<T>) => Plugin<R, Tag>;

/**
 * 
 * Denotes a function that creates a list of renderer plugins based on given file. These plugins
 * will be plugged into the renderer that is subsequently used to render an HTML document from the
 * file content.
 * 
 */
export type PluginListBuilder<T, R=any, Tag=any> = (f: File<T>) => Plugin<R, Tag>[];

/**
 * 
 * Convenience function for rxline files. Returns a transform that converts the content 
 * of an rxline `File<T>` using the given `BuildFunc<T>` to a file whose content 
 * is a compiled document.
 * 
 * @param builder
 * 
 */
export function build<T>(builder: BuildFunc<T>): Function<File<T>, File<Compiled>>;


/**
 * 
 * Convenience function for rxline files. Returns a transform that converts the content 
 * of an rxline `File<T>` using the given `BuildFunc<T>` to a file whose content 
 * is a compiled document. Uses provided plugins or `PluginBuilder`s to create plugins
 * that are to be plugged in the renderer to be used.
 * 
 * @param builder
 * @param plugins
 * 
 */
export function build<T>(builder: BuildFunc<T>, ...plugins: (PluginBuilder<T> | Plugin<any, any>)[]):
  Function<File<T>, File<Compiled>>;

export function build<T>(builder: BuildFunc<T>, 
                        ...plugins: (PluginBuilder<T> | Plugin<any, any>)[]
  ): Function<File<T>, File<Compiled>> {
  let pluginBuilder: PluginListBuilder<T>;
  if (plugins && plugins.length > 0) {
    pluginBuilder = (f: File<T>) => 
      plugins.map(p => (typeof p === 'function') ? p(f) : p);
  }

  return function(f: File<T>) {
    const plugins = pluginBuilder ? pluginBuilder(f) : [];
    return {
      ...f,
      content: compile((renderer, document) => builder(f.content, renderer, f, document), ...plugins)
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
