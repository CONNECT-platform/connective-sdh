import { transport } from '../src/dynamic/transport';


export function Hellow({name}: any, renderer: any) {
  return <div>Hellow {name}!!!</div>
}


export const $Hellow = transport(Hellow);
