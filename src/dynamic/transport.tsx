import { CompType, PropsType, autoId } from '@connectv/html';

import { callTrace } from './trace';
import { ComponentThis } from '../static';
import { recipientPromise } from '../static/promise';

import { createInfo, attachInfo } from './transport-info';



export function transport(component: CompType<any>) {
  const trace = callTrace();
  if (!trace) return component;   // --> unable to get trace info, perhaps client side code

  const info = createInfo(component.name, trace);

  return function(this: ComponentThis, props: PropsType<any>, renderer: any) {
    const id = autoId();
    const script = <script id={id}>
(function(){'{'}
  window.addEventListener("load", function(){'{'}
    if (window.__sdh_transport)
      window.__sdh_transport("{id}", "{info.hash}", {
          Promise.all(
            Object.keys(props).map(
              async key => [key, await this.expose.in(key, recipientPromise<RawValue>())]
            )
          )
          .then(entries => entries.reduce((obj, [key, value]) => {
            obj[key as any] = value;
            return obj;
          }, {} as any))
          .then(JSON.stringify)
      });
  });
})()
    </script>;
    attachInfo(script, info);
    return script;
  };
}
