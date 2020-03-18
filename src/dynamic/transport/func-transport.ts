import { callTrace } from '../../shared/trace';
import { createInfo, TransportInfo } from './transport-info';


/**
 *
 * Denotes a function that can be transported to the client-side.
 *
 */
export type TransportableFunc<T> = () => T;

/**
 *
 * Denotes a function that is to be transported to the client-side.
 *
 */
export type TransportedFunc<T> = TransportableFunc<T> & {
  __transport_info: TransportInfo;
}

/**
 *
 * Attaches necessary transport information to given transportable function.
 *
 * @param func
 * @returns the same function (with transport info attached)
 *
 */
export function funcTransport<T>(func: TransportableFunc<T>): TransportedFunc<T> {
  const trace = callTrace();
  if (!trace) return func as any; // --> unable to get trace info, perhaps client side code

  (func as any).__transport_info = createInfo(func.name, trace);
  return func as TransportedFunc<T>;
}


/**
 *
 * @param func
 * @returns attached transport information of given transported function, if any.
 *
 */
export function getFuncTransportInfo<T>(func: TransportedFunc<T>) {
  return func.__transport_info;
}
