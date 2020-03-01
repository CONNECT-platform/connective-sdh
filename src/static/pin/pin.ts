import { isPinLike, PinLike } from '@connectv/core';

import { PropertyPlugin, AppendPlugin, PluginPriority } from '@connectv/html';

import { attachPromise, whenRendered } from '../lifecycle';


export class PinPlugin<R, T> implements 
  PropertyPlugin<R | PinLike, T>, 
  AppendPlugin<R | PinLike, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | PinLike, host: HTMLElement) {
    if (isPinLike(target)) {
      whenRendered(host, () => {
        attachPromise(host, target.observable.toPromise().then(v => {
          if (typeof v.value === 'boolean') {
            if (v.value) host.setAttribute(prop, '');
            else host.removeAttribute(prop);
          }
          else
            host.setAttribute(prop, (v.value !== undefined) ? v.value.toString() : '')
        }));
      });

      return true;
    }

    return false;
  }

  append(target: R | Node | PinLike, host: Node) {
    if (isPinLike(target)) {
      let _target = document.createTextNode('');

      whenRendered(host, () => {
        attachPromise(host, target.observable.toPromise().then(v => {
          _target.textContent = (v && v.value !== undefined) ? v.value.toString() : '';
        }));
      });

      host.appendChild(_target);

      return true;
    }

    return false;
  }
}
