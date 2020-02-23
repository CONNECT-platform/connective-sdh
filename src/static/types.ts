import { CompType } from '@connectv/html';


export type Renderable = RawValue | Promise<RawValue> | Promise<Node>;
export type ComponentType = string | CompType<Renderable, string>;