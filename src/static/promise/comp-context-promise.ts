import { Observable } from 'rxjs';
import { isPinLike } from '@connectv/core';
import { CompContextPlugin, PluginPriority } from '@connectv/html';

import { RecipientPromise, isRecipientPromise } from './recipient-promise';


export class CompContextPromisePlugin<R, T> implements CompContextPlugin<R, T> {
  wireContext(_: string, value: any, recipient: any, __: any) {
    if (isRecipientPromise(recipient)) {
      if (isPinLike(value)) value.observable.toPromise().then(v => recipient.recieve(v.value));
      else if (value instanceof Observable) value.toPromise().then(v => recipient.recieve(v));
      else if (value instanceof Promise) value.then(v => recipient.recieve(v));
      else recipient.recieve(value);

      return true;
    }

    return false;
  }

  priority = PluginPriority.High;
}
