import { ExtensibleRenderer, CompType, RefPlugin, InnerHTMLPlugin, ComponentPlugin, Component } from '@connectv/html';


export type Renderable = RawValue | Promise<RawValue> | Promise<Node>;
export type ComponentType = string | CompType<Renderable, string>;


export class StaticRenderer extends ExtensibleRenderer<Renderable, ComponentType> {
  constructor() {
    super(
      new RefPlugin<Renderable, ComponentType>(),
      new InnerHTMLPlugin<Renderable, ComponentType>(),
      new ComponentPlugin<Renderable, ComponentType>(),
    );
  }
}


export abstract class StaticComponent extends Component<Renderable, ComponentType> {}
