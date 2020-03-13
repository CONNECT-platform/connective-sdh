import { RendererLike } from '@connectv/html';

import { callTrace } from '../shared/trace';
import { createInfo } from './transport-info';


/**
 *
 * Denotes a function that returns a client-side renderer.
 *
 */
export type RendererFactory<R, T> = () => RendererLike<R, T>;


/**
 *
 * Attaches necessary transport information to given renderer factory function.
 *
 * @param factory 
 * @returns the given factory function
 *
 */
export function rendererTransport<R, T>(factory: RendererFactory<R, T>) {
  const trace = callTrace();
  if (!trace) return factory; // --> unable to get trace info, perhaps client side code

  (factory as any).__transport_info = createInfo(factory.name, trace);
  return factory;
}


/**
 *
 * @param factory
 * @returns attached transport information of given renderer factory function, if any.
 *
 */
export function getRendererTransportInfo<R, T>(factory: RendererFactory<R, T>) {
  return (factory as any).__transport_info;
}
