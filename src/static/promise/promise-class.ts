import { ClassListFixed, PluginPriority, PropertyPlugin } from '@connectv/html';


import { attachPromise } from "../../shared/lifecycle";


export class PromiseClassPlugin<R, T> implements 
  PropertyPlugin<R | Promise<RawValue>, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | Promise<RawValue>, host: HTMLElement) {
    if (prop === 'class' && target instanceof Promise) {
      attachPromise(host, target.then(v => {
        let classes = (v !== undefined) ? v.toString() : '';
        const fixed = ClassListFixed.get(host);
        if (fixed.length > 0)
          classes += ' ' + fixed.join(' ');

        host.setAttribute('class', classes);
      }));

      return true;
    }

    return false;
  }
}
