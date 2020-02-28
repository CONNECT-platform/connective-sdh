import { Observable } from 'rxjs';
import { ClassListFixed, PropertyPlugin, PluginPriority } from "@connectv/html";

import { attachPromise } from '../is-ready';


export class ObservableClassPlugin<R, T> implements 
  PropertyPlugin<R | Observable<RawValue>, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | Observable<RawValue>, host: HTMLElement) {
    if (prop === 'class' && target instanceof Observable) {
      attachPromise(host, target.toPromise().then(v => {
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
