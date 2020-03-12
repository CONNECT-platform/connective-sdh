import { File } from 'rxline/fs';
import { Function } from 'rxline';

import { Compiled, PostProcessor } from './compiled';
import { StaticRenderer } from './renderer';
import { compile } from './compile';


export type BuildFunc<T> = (t: T, renderer: StaticRenderer, document: Document) => Node | Promise<Node>;


export function build<T>(builder: BuildFunc<T>): Function<File<T>, File<Compiled>> {
  return function(f: File<T>) {
    return {
      ...f,
      content: compile((renderer, document) => builder(f.content, renderer, document))
    };
  }
}


export function post(processor: PostProcessor): Function<File<Compiled>, File<Compiled>> {
  return function(f: File<Compiled>) {
    f.content.post(processor);
    return f;
  }
}


export function serialize(): Function<File<Compiled>, File<string>> {
  return async function(f: File<Compiled>) {
    return {
      ...f,
      content: await f.content.serialize()
    }
  }
}


export function saveCompiledFile(): Function<File<Compiled>, File<string>> {
  return async function(f: File<Compiled>) {
    return f.content.save(f.path, f.root);
  }
}
