import { CompType, PropsType, autoId } from '@connectv/html';
import { createHash } from 'crypto';

import { callTrace } from './trace';


export interface TransportInfo {
  name: string;
  filename: string;
  hash: string;
}


function _hash(x: string) {
  return createHash('md5').update(x).digest('base64').toString();
}


export function transport(component: CompType) {
  const trace = callTrace();
  if (!trace) return component;   // --> unable to get trace info, perhaps client side code

  const info = {
    filename: trace.getFileName(),
    name: component.name,
    hash: _hash(trace.getFileName() + '::' + component.name),
  }

  return (props: PropsType<RawValue>, renderer: any) => {
    const id = autoId();
    const script = 
`(function(){
  window.addEventListener("load", function(){
    if (window.__sdh_transport)
      window.__sdh_transport("${id}", "${info.hash}", ${JSON.stringify(props)});
  });
})()`
    const el = <script id={id}>{script}</script>;
    (el as any).__transport_info = info;
    return el;
  };
}
