import { Subject, Observable } from 'rxjs';
import { isPinLike } from '@connectv/core';
import { PluginPriority, ComponentSignature, CompPropPlugin } from '@connectv/html';


export class CompInputSubjectPlugin<R, T> implements CompPropPlugin<R, T> {
  wireProp(name: string, prop: any, _: Node, signature: ComponentSignature) {
    if (signature.inputs && name in signature.inputs && signature.inputs[name] instanceof Subject) {
      const input = signature.inputs[name] as Subject<any>;

      if (prop instanceof Observable) prop.subscribe(input);
      else if (isPinLike(prop)) prop.observable.subscribe(v => input.next(v.value));
      else if (prop instanceof Promise) prop.then(v => input.next(v));
      else input.next(prop);

      return true;
    }

    return false;
  }

  priority = PluginPriority.High;
}
