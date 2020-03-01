import { Subject, Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPinLike } from '@connectv/core';
import { PluginPriority, ComponentSignature, CompPropPlugin } from '@connectv/html';

import { whenRendered } from '../lifecycle';


export class CompInputSubjectPlugin<R, T> implements CompPropPlugin<R, T> {
  wireProp(name: string, prop: any, host: Node, signature: ComponentSignature) {
    if (signature.inputs && name in signature.inputs && signature.inputs[name] instanceof Subject) {
      const input = signature.inputs[name] as Subject<any>;

      if (prop instanceof Observable) whenRendered(host, () => prop.subscribe(input));
      else if (isPinLike(prop)) whenRendered(host, () => prop.observable.pipe(map(e => e.value)).subscribe(input));
      else if (prop instanceof Promise) whenRendered(host, () => from(prop).subscribe(input));
      else whenRendered(host, () => of(prop).subscribe(input));

      return true;
    }

    return false;
  }

  priority = PluginPriority.High;
}
