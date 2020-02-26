import { JSDOM } from 'jsdom';
const registerGlobalDom = require('jsdom-global');

import { StaticRenderer } from './renderer';
import { Compiled } from './compiled';


export type RenderFunc = (
    renderer: StaticRenderer, 
    document: Document,
  ) => Node | Promise<Node>;


export function compile(render: RenderFunc) {
  try { document } catch(_) { registerGlobalDom(); }

  const dom = new JSDOM();
  const renderer = new StaticRenderer();

  return new Compiled(dom, (async() => {
    const node = await render(
      renderer,
      dom.window.document
    );

    if (node instanceof HTMLHtmlElement) {
      (node.firstChild as Node).childNodes.forEach(child => renderer.render(child).on(dom.window.document.head));
      (node.lastChild as Node).childNodes.forEach(child => renderer.render(child).on(dom.window.document.body));
      // TODO: clean this up
      // TODO: set body attributes as well
    }
    else if (node instanceof HTMLHeadElement) {
      node.childNodes.forEach(child => renderer.render(child).on(dom.window.document.head));
    }
    else if (node instanceof HTMLBodyElement) {
      node.childNodes.forEach(child => renderer.render(child).on(dom.window.document.body));
    }
    else {
      renderer.render(node).on(dom.window.document.body);
    }
  })());
}
