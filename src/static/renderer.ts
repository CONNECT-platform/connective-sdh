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


export class StaticRenderer extends ExtensibleRenderer<Renderable, ComponentType> {
  constructor() {
    super(
      new RefPlugin<Renderable, ComponentType>(),
      new InnerHTMLPlugin<Renderable, ComponentType>(),
      new ComponentPlugin<Renderable, ComponentType>(),
      new ExposePlugin<Renderable, ComponentType>(),
      new CheckCompInputsPlugin<Renderable, ComponentType>(),
      ...observablePlugins<Renderable, ComponentType>(),
      ...promisePlugins<Renderable, ComponentType>(),
      ...pinPlugins<Renderable, ComponentType>(),
    );
  }
}


export abstract class StaticComponent extends Component<Renderable, ComponentType> {}


export type ComponentThis = {
  expose: ExposeFunction;
  context: ContextFunction;
}


export type SafeComponentThis = {
  expose?: ExposeFunction;
  context?: ContextFunction;
}
