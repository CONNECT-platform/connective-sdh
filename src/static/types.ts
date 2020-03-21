import { Observable } from 'rxjs';
import { PinLike } from '@connectv/core';
import { CompType, Plugin } from '@connectv/html';


export type Renderable = RawValue | Promise<RawValue> | Promise<Node> | Observable<RawValue> | PinLike;
export type ComponentType = string | CompType<Renderable, string>;


/**
 *
 * Denotes a plugin that conducts post-processing on the final HTML document.
 *
 */
export interface PostProcessPlugin<R, T> extends Plugin<R, T> {
  post(html: HTMLDocument): void | Promise<void>;
}


/**
 *
 * @param plugin
 * @returns `true` if given plugin is a `PostProcessPlugin`, `false` otherwise.
 *
 */
export function isPostProcessPlugin<R, T>(plugin: Plugin<R, T>): plugin is PostProcessPlugin<R, T> {
  return !!plugin && !!(plugin as any).post && typeof (plugin as any).post === 'function';
}
