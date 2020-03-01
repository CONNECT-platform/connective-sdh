import { PropertyPlugin, AppendPlugin, PluginPriority, Marker, RawRenderer } from '@connectv/html';

import { attachPromise } from '../lifecycle';


export class PromisePlugin<R, T> implements 
  PropertyPlugin<R | Promise<RawValue>, T>, 
  AppendPlugin<R | Promise<RawValue | Node>, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | Promise<RawValue>, host: HTMLElement) {
    if (target instanceof Promise) {
      attachPromise(host, target.then(v => {
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

  append(target: R | Node | Promise<RawValue | Node>, host: Node, 
          renderer: RawRenderer<R | Promise<RawValue | Node>, T>) {
    if (target instanceof Promise) {
      const marker = <Marker/>;
      host.appendChild(marker);

      attachPromise(host, target.then(v => {
        let _target: Node;
        if (v instanceof Node) _target = v;
        else _target = document.createTextNode((v !== undefined) ? v.toString() : '');

        host.insertBefore(_target, marker);
        marker.remove();
      }));

      return true;
    }

    return false;
  }
}
