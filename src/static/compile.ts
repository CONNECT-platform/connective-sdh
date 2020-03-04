import { JSDOM } from 'jsdom';
const registerGlobalDom = require('jsdom-global');

import { StaticRenderer } from './renderer';
import { Compiled } from './compiled';
import { itsRendered } from '../shared/lifecycle';


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

    const headNodes = <Node[]>[];
    const bodyNodes = <Node[]>[];

    if (node instanceof HTMLHtmlElement) {
      node.firstChild?.childNodes.forEach(n => headNodes.push(n));
      node.lastChild?.childNodes.forEach(n => bodyNodes.push(n));

      // TODO: clean this up
      // TODO: set body attributes as well
    }
    else if (node instanceof HTMLHeadElement) {
      node.childNodes.forEach(n => headNodes.push(n));
    }
    else if (node instanceof HTMLBodyElement) {
      node.childNodes.forEach(n => bodyNodes.push(n));
    }
    else {
      bodyNodes.push(node);
    }

    headNodes.forEach(node => renderer.render(node).on(dom.window.document.head));
    bodyNodes.forEach(node => renderer.render(node).on(dom.window.document.body));

    itsRendered(dom.window.document);
  })());
}
