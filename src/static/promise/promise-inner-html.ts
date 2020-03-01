import { PluginPriority, PropertyPlugin } from "@connectv/html";

import { attachPromise } from "../lifecycle";


export class PromiseInnerHTMLPlugin<R, T> implements 
  PropertyPlugin<R | Promise<RawValue>, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | Promise<RawValue>, host: HTMLElement) {
    if (prop === '_innerHTML' && target instanceof Promise) {
      attachPromise(host, target.then(v => {
        host.innerHTML = v!==undefined?v.toString():'';
      }));

      return true;
    }

    return false;
  }
}
