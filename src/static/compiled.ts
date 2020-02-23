import { JSDOM } from 'jsdom';
import { writeFile } from 'rxline/fs';


export class Compiled {
  constructor(readonly dom: JSDOM, readonly ready: Promise<void>) {}

  async toString() {
    await this.ready;
    return this.dom.serialize();
  }

  async toFile(path: string, root?: string) {
    await this.ready;
    return writeFile()({ path, root: root || '',  content: this.dom.serialize() });
  }
}
