import { Observable } from 'rxjs';
import { isPinLike } from '@connectv/core';
import { CompInputOptions, CompPropPlugin, PluginPriority, 
          ComponentSignature, CompInputWithOptions } from '@connectv/html';

import { whenRendered } from '../lifecycle';


export interface CompInputPromise<T> extends Promise<T>, CompInputWithOptions<T> {
  recieve: (t: T | PromiseLike<T>) => void;
}


export function inputPromise<T>(options?: CompInputOptions<T>): CompInputPromise<T> {
  let _Resolve: (t: T | PromiseLike<T>) => void = () => {};
  const promise: CompInputPromise<T> = new Promise((resolve) => { _Resolve = resolve; }) as any;
  promise.inputOptions = options || {};
  promise.recieve = _Resolve;
  return promise;
}


export function isCompInputPromise<T>(whatever: Promise<T>): whatever is CompInputPromise<T> {
  return whatever && whatever instanceof Promise && (whatever as any).inputOptions && (whatever as any).recieve
        && typeof (whatever as any).recieve === 'function';
}


export class CompInputPromisePlugin<R, T> implements CompPropPlugin<R, T> {
  priority = PluginPriority.High;

  wireProp(name: string, prop: any, host: Node, signature: ComponentSignature) {
    if (signature.inputs && name in signature.inputs && isCompInputPromise(signature.inputs[name])) {
      const input = signature.inputs[name] as CompInputPromise<any>;

      if (prop instanceof Observable) whenRendered(host, () => prop.toPromise().then(v => input.recieve(v)));
      else if (isPinLike(prop)) whenRendered(host, () => prop.observable.toPromise().then(v => input.recieve(v.value)));
      else if (prop instanceof Promise) prop.then(v => input.recieve(v));
      else input.recieve(prop);

      return true;
    }

    return false;
  }
}
