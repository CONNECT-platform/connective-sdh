import { RendererLike } from '@connectv/html';

import { callTrace } from '../shared/trace';
import { createInfo } from './transport-info';


export type RendererFactory<R, T> = () => RendererLike<R, T>;

export function rendererTransport<R, T>(factory: RendererFactory<R, T>) {
  const trace = callTrace();
  if (!trace) return factory; // --> unable to get trace info, perhaps client side code

  (factory as any).__transport_info = createInfo(factory.name, trace);
  return factory;
}


export function getRendererTransportInfo<R, T>(factory: RendererFactory<R, T>) {
  return (factory as any).__transport_info;
}
