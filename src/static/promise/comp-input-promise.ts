import { Observable } from 'rxjs';
import { isPinLike } from '@connectv/core';
import { CompInputOptions, CompPropPlugin, PluginPriority, 
          ComponentSignature, CompInputWithOptions } from '@connectv/html';


export class CompInputPromise<T> extends Promise<T> implements CompInputWithOptions<T> {
  private _resolve: (t: T | PromiseLike<T>) => void;

  constructor(readonly inputOptions: CompInputOptions<T> = {}) {
    super(resolve => {
      this._resolve = resolve;
    });
  }

  recieve(t: T) {
    this._resolve(t);
  }
}


export class CompInputPromisePlugin<R, T> implements CompPropPlugin<R, T> {
  priority = PluginPriority.High;

  wireProp(name: string, prop: any, _: Node, signature: ComponentSignature) {
    if (signature.inputs && name in signature.inputs && signature.inputs[name] instanceof CompInputPromise) {
      const input = signature.inputs[name] as CompInputPromise<any>;

      if (prop instanceof Observable) prop.toPromise().then(v => input.recieve(v));
      else if (isPinLike(prop)) prop.observable.toPromise().then(v => input.recieve(v.value));
      else if (prop instanceof Promise) prop.then(v => input.recieve(v));
      else input.recieve(prop);

      return true;
    }

    return false;
  }
}
