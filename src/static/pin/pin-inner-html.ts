import { PinLike, isPinLike } from '@connectv/core';
import { PropertyPlugin, PluginPriority } from "@connectv/html";

import { attachPromise, whenRendered } from '../lifecycle';


export class PinInnerHTMLPlugin<R, T> implements 
  PropertyPlugin<R | PinLike, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | PinLike, host: HTMLElement) {
    if (prop === '_innerHTML' && isPinLike(target)) {
      whenRendered(host, () => {
        attachPromise(host, target.observable.toPromise().then(v => {
          host.innerHTML = (v.value !== undefined)?v.value.toString():'';
        }));
      });

      return true;
    }

    return false;
  }
}
