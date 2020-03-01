import { PinLike, isPinLike } from '@connectv/core';
import { ClassListFixed, PropertyPlugin, PluginPriority } from "@connectv/html";

import { attachPromise, whenRendered } from '../lifecycle';


export class PinClassPlugin<R, T> implements 
  PropertyPlugin<R | PinLike, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | PinLike, host: HTMLElement) {
    if (prop === 'class' && isPinLike(target)) {
      whenRendered(host, () => {
        attachPromise(host, target.observable.toPromise().then(v => {
          let classes = (v.value !== undefined) ? v.value.toString() : '';
          const fixed = ClassListFixed.get(host);
          if (fixed.length > 0)
            classes += ' ' + fixed.join(' ');
  
          host.setAttribute('class', classes);
        }));
      });

      return true;
    }

    return false;
  }
}
