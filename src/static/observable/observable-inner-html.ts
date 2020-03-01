import { Observable } from 'rxjs';
import { PropertyPlugin, PluginPriority } from "@connectv/html";

import { attachPromise, whenRendered } from '../lifecycle';


export class ObservableInnerHTMLPlugin<R, T> implements 
  PropertyPlugin<R | Observable<RawValue>, T> {

  priority = PluginPriority.Fallback;

  setprop(prop: string, target: R | Observable<RawValue>, host: HTMLElement) {
    if (prop === '_innerHTML' && target instanceof Observable) {
      whenRendered(host, () => {
        attachPromise(host, target.toPromise().then(v => {
          host.innerHTML = (v !== undefined)?v.toString():'';
        }));
      });

      return true;
    }

    return false;
  }
}
