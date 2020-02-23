import { JSDOM } from 'jsdom';
import { writeFile } from 'rxline/fs';

import { isReady } from './is-ready';


export class Compiled {
  constructor(readonly dom: JSDOM, readonly ready: Promise<void>) {}

  async isReady() {
    await this.ready;
    await isReady(this.dom.window.document.head);
    await isReady(this.dom.window.document.body);

    return true;
  }

  async toString() {
    await this.isReady();
    return this.dom.serialize();
  }

  async toFile(path: string, root?: string) {
    await this.isReady();
    return writeFile()({ path, root: root || '',  content: this.dom.serialize() });
  }
}
