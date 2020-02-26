import { isPinLike, PinLike } from '@connectv/core';

import { PropertyPlugin, AppendPlugin, PluginPriority } from '@connectv/html';

import { attachPromise } from '../is-ready';


export class PinPlugin<R, T> implements 
  PropertyPlugin<R | PinLike, T>, 
  AppendPlugin<R | PinLike, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | PinLike, host: HTMLElement) {
    if (isPinLike(target)) {
      attachPromise(host, target.observable.toPromise().then(v => {
        if (typeof v === 'boolean') {
          if (v) host.setAttribute(prop, '');
          else host.removeAttribute(prop);
        }
        else
          host.setAttribute(prop, (v !== undefined) ? v.toString() : '')
      }));

      return true;
    }

    return false;
  }

  append(target: R | Node | PinLike, host: Node) {
    if (isPinLike(target)) {
      let _target = document.createTextNode('');

      attachPromise(host, target.observable.toPromise().then(v => {
        _target.textContent = (v.value !== undefined) ? v.value.toString() : '';
      }));

      host.appendChild(_target);

      return true;
    }

    return false;
  }
}
