import { CompInputWithOptions, CompInputOptions } from '@connectv/html';


export interface RecipientPromise<T> extends Promise<T>, CompInputWithOptions<T> {
  recieve: (t: T | PromiseLike<T>) => void;
}


export function isRecipientPromise<T>(whatever: Promise<T>): whatever is RecipientPromise<T> {
  return whatever && whatever instanceof Promise && (whatever as any).inputOptions && (whatever as any).recieve
        && typeof (whatever as any).recieve === 'function';
}


export function recipientPromise<T>(options?: CompInputOptions<T>): RecipientPromise<T> {
  let _Resolve: (t: T | PromiseLike<T>) => void = () => {};
  const promise: RecipientPromise<T> = new Promise((resolve) => { _Resolve = resolve; }) as any;
  promise.inputOptions = options || {};
  promise.recieve = _Resolve;
  return promise;
}
