import { state } from '@connectv/core';

import { transport } from '../src/dynamic/transport';
import { hi } from './somecode';


export function Hellow({name}: any, renderer: any) {
  const count = state(0);

  return <div onclick={() => count.value += 1}>{hi()} {name}!!! [{count}]</div>
}


export const $Hellow2 = transport(Hellow);
