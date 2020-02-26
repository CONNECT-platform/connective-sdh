import { Observable } from 'rxjs';
import { PinLike } from '@connectv/core';
import { CompType } from '@connectv/html';


export type Renderable = RawValue | Promise<RawValue> | Promise<Node> | Observable<RawValue> | PinLike;
export type ComponentType = string | CompType<Renderable, string>;