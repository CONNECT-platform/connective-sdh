import { Observable } from 'rxjs';
import { isPinLike } from '@connectv/core';
import { CompPropPlugin, PluginPriority, 
          ComponentSignature } from '@connectv/html';

import { whenRendered } from '../../shared/lifecycle';
import { RecipientPromise, isRecipientPromise } from './recipient-promise';



export class CompInputPromisePlugin<R, T> implements CompPropPlugin<R, T> {
  priority = PluginPriority.High;

  wireProp(name: string, prop: any, host: Node, signature: ComponentSignature) {
    if (signature.inputs && name in signature.inputs && isRecipientPromise(signature.inputs[name])) {
      const input = signature.inputs[name] as RecipientPromise<any>;

      if (prop instanceof Observable) whenRendered(host, () => prop.toPromise().then(v => input.recieve(v)));
      else if (isPinLike(prop)) whenRendered(host, () => prop.observable.toPromise().then(v => input.recieve(v.value)));
      else if (prop instanceof Promise) prop.then(v => input.recieve(v));
      else input.recieve(prop);

      return true;
    }

    return false;
  }
}
