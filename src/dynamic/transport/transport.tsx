import { CompType, autoId } from '@connectv/html';

import { callTrace } from '../../shared/trace';
import { ComponentThis } from '../../static';
import { recipientPromise } from '../../static/promise/recipient-promise';

import { createInfo, attachInfo, TransportInfo } from './transport-info';


/**
 *
 * @param component
 * @returns all attached `TransportInfo` on the given component, if any.
 *
 */
export function getCompTransportInfo(component: CompType<any, any>) {
  return (component as any).__transport_info;
}


/**
 *
 * Attaches given `TransportInfo` on given component.
 *
 * @param component
 * @param info
 *
 */
export function attachCompTransportInfo(component: CompType<any, any>, info: TransportInfo) {
  (component as any).__transport_info = { ...info, resolved: false };
}


/**
 *
 * Creates a _transport reference_. A _transport reference_ can be used to conduct
 * **broad transport**, i.e. you can have the content that is supposed to be rendered
 * on the client side also replace some server-side-rendered content:
 *
 * ```tsx
 * function myComp(_, renderer) {
 *   const tr = transportRef();
 * 
 *   return <fragment>
 *     <StaticComponent _transport={tr}/>       // --> rendered on server-side
 *     <div data-transport={tr}/>               // --> rendered on server-side
 *     <TransportComponent _transport={tr}/>    // --> rendered on client-side, replaces the others.
 *   </fragment>
 * }
 * ```
 * 
 * @returns a _transport reference_
 * 
 *
 */
export function transportRef() { return autoId(); }


/**
 *
 * Creates a transport component based on given (original) component.
 * On the server-side, the transport component ensures _CLIENT-SIDE_ rendering
 * of original component on the same spot in the DOM tree with same properties.
 * On the client-side, the transport component is identical to the original component.
 *
 * example:
 * 
 * ```tsx
 * import { state } from '@connectv/core';
 * import { transport } from '@connectv/sdh/transport';
 * 
 * export function Counter(_, renderer) {
 *   const count = state(0);
 *   return <div onclick={() => count.value++}>You clicked {count} times!</div>;
 * }
 *
 * export const $Counter = transport(Counter);
 * ```
 *
 * In this example, you cannot use `Counter` component on server-side rendering since it needs
 * to bind to user clicks (trying to render it actually results in an error). However, you can
 * utilize `$Counter` instead, and it will ensure that `Counter` is rendered on the same locations
 * on the DOM tree that you rendered `$Counter` on, on the client-side.
 *
 * @note You MUST export both the original component and the transport component, from the same file.
 * This is how the original component is then imported (alongside with any possible dependencies)
 * into client bundles.
 *
 * @note Any properties passed to the transport component will be used in rendering of the original
 * component. However, you CANNOT pass any child elements to the transport component.
 *
 */
export function transport(component: any) {
  const trace = callTrace();
  if (!trace) return component;   // --> unable to get trace info, perhaps running on client.

  const info = createInfo(component.name, trace);

  const comp = function(this: ComponentThis, props: any, renderer: any) {
    const id = props._transport || transportRef();
    const script = <script id={id}>
(function(){'{'}
  function load(){'{'}
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
  };

  if (document.readyState == 'complete') load();
  else window.addEventListener('load', load);

  window.setImmediate = window.setImmediate || function(f){'{'}setTimeout(f, 0)};
})()
    </script>;
    attachInfo(script, info);
    return script;
  };

  attachCompTransportInfo(comp, info);
  return comp;
}
