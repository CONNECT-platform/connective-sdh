import { CompType, autoId } from '@connectv/html';

import { callTrace } from './trace';
import { ComponentThis } from '../static';
import { recipientPromise } from '../static/promise/recipient-promise';

import { createInfo, attachInfo, TransportInfo } from './transport-info';



export function getCompTransportInfo(component: CompType<any, any>) {
  return (component as any).__transport_info;
}


export function attachCompTransportInfo(component: CompType<any, any>, info: TransportInfo) {
  (component as any).__transport_info = { ...info, resolved: false };
}


export function transportRef() { return autoId(); }


export function transport(component: CompType<any, any>) {
  const trace = callTrace();
  if (!trace) return component;   // --> unable to get trace info, perhaps client side code

  const info = createInfo(component.name, trace);

  const comp = function(this: ComponentThis, props: any, renderer: any) {
    const id = props._transport || transportRef();
    const script = <script id={id}>
(function(){'{'}
  window.addEventListener("load", function(){'{'}
    if (window.__sdh_transport){'{'}
      window.__sdh_transport("{id}", "{info.hash}", {
          Promise.all(
            Object.keys(props).filter(key => key !== '_transport').map(
              async key => [key, await this.expose.in(key, recipientPromise<RawValue>())]
            )
          )
          .then(entries => entries.reduce((obj, [key, value]) => {
            obj[key as any] = value;
            return obj;
          }, {} as any))
          .then(JSON.stringify)
      });
      {
        props._transport?
        `document.querySelectorAll('[data-transport="${props._transport}"]').forEach(function(node){node.remove()});`
        :''
      }
    }
  });
})()
    </script>;
    attachInfo(script, info);
    return script;
  };

  attachCompTransportInfo(comp, info);
  return comp;
}
