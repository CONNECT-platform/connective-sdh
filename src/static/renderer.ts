import { ExtensibleRenderer, RefPlugin, InnerHTMLPlugin, ComponentPlugin, Component } from '@connectv/html';

import { Renderable, ComponentType } from './types';
import { promisePlugins } from './plugins';


export class StaticRenderer extends ExtensibleRenderer<Renderable, ComponentType> {
  constructor() {
    super(
      new RefPlugin<Renderable, ComponentType>(),
      new InnerHTMLPlugin<Renderable, ComponentType>(),
      new ComponentPlugin<Renderable, ComponentType>(),
      ...promisePlugins<Renderable, ComponentType>(),
    );
  }
}


export abstract class StaticComponent extends Component<Renderable, ComponentType> {}
