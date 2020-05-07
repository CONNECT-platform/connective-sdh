import { JSDOM } from 'jsdom';
const registerGlobalDom = require('jsdom-global');
import { Plugin } from '@connectv/html';

import { StaticRenderer } from './renderer';
import { Compiled } from './compiled';
import { itsRendered } from '../shared/lifecycle';
import { isPostProcessPlugin } from './types';


/**
 *
 * Denotes a function that renders some HTML content (in form of an HTML Node)
 * using given renderer and document objects.
 *
 */
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


/**
 *
 * Will create a `Compiled` object from given render function. A render function
 * is any function that returns an HTML Node (or a promise of one), given the proper
 * renderer and document objects.
 *
 * It will also apply any post processors to the `Compiled` object from plugins
 * that are `PostProcessPlugins`, allowing given renderer plugins to do some post processing
 * on the final document.
 *
 * @param render the render function
 * @param plugins a list of renderer plugins to be attached to the renderer
 *
 */
export function compile(render: RenderFunc, ...plugins: Plugin<any, any>[]) {
  try { document } catch(_) { registerGlobalDom(); }

  const dom = new JSDOM('<!DOCTYPE html>');
  const renderer = new StaticRenderer().plug(...plugins);

  const compiled = new Compiled(dom, (async() => {
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

  renderer.plugins.filter(isPostProcessPlugin).forEach(plugin => compiled.post(doc => plugin.post(doc)));
  return compiled;
}
