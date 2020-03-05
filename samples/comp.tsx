import { timer } from 'rxjs';

import { transport } from '../src/dynamic/transport';


export function Hellow({name}: any, renderer: any) {
  return <div>Hellow {name}!!! [{timer(0, 1000)}]</div>
}


export const $Hellow = transport(Hellow);
