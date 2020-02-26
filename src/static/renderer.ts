import { ExtensibleRenderer, RefPlugin, InnerHTMLPlugin, ComponentPlugin, Component, ExposePlugin, CheckCompInputsPlugin } from '@connectv/html';

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
      ...pinPlugins<Renderable, ComponentType>(),
      ...promisePlugins<Renderable, ComponentType>(),
    );
  }
}


export abstract class StaticComponent extends Component<Renderable, ComponentType> {}
