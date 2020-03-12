import { ExtensibleRenderer, Component,
        RefPlugin, 
        InnerHTMLPlugin, 
        ComponentPlugin, 
        ExposePlugin, 
        CheckCompInputsPlugin, 
        ExposeFunction,
        ContextFunction} from '@connectv/html';

import { Renderable, ComponentType } from './types';
import { observablePlugins } from './observable';
import { pinPlugins } from './pin';
import { promisePlugins } from './promise';
import { ContextPlugin } from './context';
import { TransportPlugin } from './transport';


/**
 * 
 * A renderer (child of `ExtensibleRenderer` class from `@connectv/html`)
 * specifically equipped to handle server-side rendering. Instances of this class
 * will be equipped with specialized plugins for SSR `Pin` (`@connectv/core`) or `Observable` (`rxjs`)
 * objects, alongside plugins for enabling rendering `Promise` objects on the DOM.
 * 
 */
export class StaticRenderer extends ExtensibleRenderer<Renderable, ComponentType> {
  constructor() {
    super(
      new RefPlugin<Renderable, ComponentType>(),
      new InnerHTMLPlugin<Renderable, ComponentType>(),
      new ComponentPlugin<Renderable, ComponentType>(),
      new TransportPlugin<Renderable, ComponentType>(),
      new ExposePlugin<Renderable, ComponentType>(),
      new CheckCompInputsPlugin<Renderable, ComponentType>(),
      new ContextPlugin<Renderable, ComponentType>(),
      ...observablePlugins<Renderable, ComponentType>(),
      ...promisePlugins<Renderable, ComponentType>(),
      ...pinPlugins<Renderable, ComponentType>(),
    );
  }
}


/**
 * 
 * The base class for SSR-compatible class-based components.
 * 
 */
export abstract class StaticComponent extends Component<Renderable, ComponentType> {}


/**
 * 
 * `this` type for SSR-compatible functional components.
 * 
 */
export type ComponentThis = {
  expose: ExposeFunction;
  context: ContextFunction;
}


/**
 * 
 * _safe_ `this` type for SSR-compatible functional components.
 * It is _safe_ since it takes into consideration possibility of
 * component functions not being provided by renderer plugins, and is
 * the safer option to use in contexts where custom renderers with
 * unknown specifications and capabilities might be utilizied to render 
 * a particular component.
 * 
 */
export type SafeComponentThis = {
  expose?: ExposeFunction;
  context?: ContextFunction;
}
