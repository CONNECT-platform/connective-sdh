import { Observable, from } from 'rxjs';
import { isPinLike, wrap, value } from '@connectv/core';
import { CompContextPlugin, PluginPriority } from '@connectv/html';


export class CompContextPinPlugin<R, T> implements CompContextPlugin<R, T> {
  wireContext(_: string, _value: any, recipient: any, __: any) {
    if (isPinLike(recipient)) {
      if (isPinLike(_value)) _value.to(recipient);
      else if (_value instanceof Observable) wrap(_value).to(recipient);
      else if (_value instanceof Promise) wrap(from(_value)).to(recipient);
      else value(_value).to(recipient);

      return true;
    }

    return false;
  }

  priority = PluginPriority.High;
}
