import { JSDOM } from 'jsdom';
const registerGlobalDom = require('jsdom-global');

import { StaticRenderer } from './renderer';
import { Compiled } from './compiled';


export type RenderFunc = (
    body: (node: Node) => void,
    head: (node: Node) => void,
    renderer: StaticRenderer, 
    document: Document,
  ) => void | Promise<void>;


export function compile(render: RenderFunc) {
  try { document } catch(_) { registerGlobalDom(); }

  const dom = new JSDOM();
  const renderer = new StaticRenderer();

  return new Compiled(dom, (async() => {
    await render(
      node => renderer.render(node).on(dom.window.document.head),
      node => renderer.render(node).on(dom.window.document.body),
      renderer,
      dom.window.document
    );
  })());
}
