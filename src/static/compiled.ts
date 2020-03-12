import { JSDOM } from 'jsdom';
import { writeFile } from 'rxline/fs';

import { isReady } from '../shared/lifecycle';


/**
 * 
 * denotes a post processor function, which executes some logic
 * on some compiled and ready for serialization html document.
 * 
 */
export type PostProcessor = (html: HTMLDocument) => void | Promise<void>;


/**
 * 
 * Represents a compiled HTML Document. A compiled HTML Document is one
 * whose structure is determined (typically via some render function),
 * perhaps should wait on some data (denoted by some promises),
 * and then can be rendered either to a string or to a file.
 * 
 */
export class Compiled {
  private _postProcessors: PostProcessor[] = [];
  private _readyPromise: Promise<boolean>;

  /**
   * 
   * @param dom   the document model object
   * @param ready a general promise to wait for before this compiled document can be
   *              serialized / saved to a file. This is typically used to render all necessary
   *              DOM structure to the given document model object.
   * 
   */
  constructor(readonly dom: JSDOM, readonly ready: Promise<void>) {}

  /**
   * 
   * @returns `true` when the document model is fully rendered and all necessary data
   *           are also fetched. DOES NOT RETURN FALSE, waits for readiness of the document
   *           instead. also runs all post processing passed via `.post()` method.
   * 
   * @note this method is idempotent, i.e. it will construct one singular promise
   *       and will return that promise on subsequent calls.
   * 
   */
  isReady() {
    if (!this._readyPromise) {
      this._readyPromise = (async() => {
        await this.ready;
        await isReady(this.dom.window.document.head);
        await isReady(this.dom.window.document.body);
  
        for (let processor of this._postProcessors) {
          await processor(this.dom.window.document);
        }
  
        return true;
      })();
    }

    return this._readyPromise;
  }

  /**
   * 
   * @returns a string representation of the compiled document model.
   * 
   */
  async serialize() {
    await this.isReady();
    return this.dom.serialize();
  }

  /**
   * 
   * saves the compiled document model to a file at given path (and given root).
   * 
   * @param path the path of the saved file
   * @param root the root of the saved file
   * @returns a `rxline.File<string>` object representing stored string content and file address.
   * 
   */
  async save(path: string, root?: string) {
    await this.isReady();
    return writeFile()({ path, root: root || '',  content: this.dom.serialize() });
  }

  /**
   * 
   * queues up given post processor. the processor will be executed
   * on the document model after it finishes compilation and all of its
   * required data are ready.
   * 
   * @param processor
   * @returns `this` for chaining convenience.
   * 
   */
  post(processor: PostProcessor) {
    this._postProcessors.push(processor);
    return this;
  }
}
