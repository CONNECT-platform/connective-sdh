import { Observable } from 'rxjs';

import { PropertyPlugin, AppendPlugin, PluginPriority } from '@connectv/html';

import { attachPromise, whenRendered } from '../../shared/lifecycle';


export class ObservablePlugin<R, T> implements 
  PropertyPlugin<R | Observable<RawValue>, T>, 
  AppendPlugin<R | Observable<RawValue>, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | Observable<RawValue>, host: HTMLElement) {
    if (target instanceof Observable) {
      whenRendered(host, () => {
        attachPromise(host, target.toPromise().then(v => {
          if (typeof v === 'boolean') {
            if (v) host.setAttribute(prop, '');
            else host.removeAttribute(prop);
          }
          else
            host.setAttribute(prop, (v !== undefined) ? v.toString() : '')
        }));
      });

      return true;
    }

    return false;
  }

  append(target: R | Node | Observable<RawValue>, host: Node) {
    if (target instanceof Observable) {
      let _target = document.createTextNode('');

      whenRendered(host, () => {
        attachPromise(host, target.toPromise().then(v => {
          _target.textContent = (v !== undefined) ? v.toString() : '';
        }));
      });

      host.appendChild(_target);

      return true;
    }

    return false;
  }
}
