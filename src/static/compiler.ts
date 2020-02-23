import { JSDOM } from 'jsdom';
const registerGlobalDom = require('jsdom-global');

import { StaticRenderer } from './renderer';


export type RenderFunc = (
    body: (node: Node) => void,
    head: (node: Node) => void,
    renderer: StaticRenderer, 
    document: Document,
  ) => void | Promise<void>;


export class Compiler {
  constructor() {
    try { document } catch(_) { registerGlobalDom(); }
  }

  async compile(render: RenderFunc): Promise<string> {
    const dom = new JSDOM();
    const renderer = new StaticRenderer();

    await render(
      node => renderer.render(node).on(dom.window.document.head),
      node => renderer.render(node).on(dom.window.document.body),
      renderer,
      dom.window.document
    );

    return dom.serialize();
  }
}
