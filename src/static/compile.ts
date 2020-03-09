import { JSDOM } from 'jsdom';
const registerGlobalDom = require('jsdom-global');

import { StaticRenderer } from './renderer';
import { Compiled } from './compiled';
import { itsRendered } from '../shared/lifecycle';


export type RenderFunc = (
    renderer: StaticRenderer, 
    document: Document,
  ) => Node | Promise<Node>;


function _render(el: Node | Node[] | null, target: HTMLElement, renderer: StaticRenderer) {
  if (!el) return;

  let nodes = <Node[]>[];
  if (el instanceof HTMLElement) el.childNodes.forEach(n => nodes.push(n));
  else if (el instanceof Node) return;
  else nodes = el;

  nodes.forEach(n => renderer.render(n).on(target));
}


function _copy_attrs(el: Node | null, target: HTMLElement) {
  if (!el || !(el instanceof HTMLElement)) return;

  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes.item(i);
    if (attr) target.setAttribute(attr.name, attr.value);
  }
}


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
      _render(node.firstChild, dom.window.document.head, renderer);
      _render(node.lastChild, dom.window.document.body, renderer);
      _copy_attrs(node.lastChild, dom.window.document.body);
    }
    else if (node instanceof HTMLHeadElement) {
      _render(node, dom.window.document.head, renderer);
    }
    else if (node instanceof HTMLBodyElement) {
      _render(node, dom.window.document.body, renderer);
      _copy_attrs(node, dom.window.document.body);
    }
    else {
      _render([node], dom.window.document.body, renderer);
    }

    itsRendered(dom.window.document);
  })());
}
