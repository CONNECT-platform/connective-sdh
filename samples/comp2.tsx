import { state } from '@connectv/core';

import { transport, transportRef } from '../src/dynamic/transport';
import { hi } from './somecode';


// Static view part:
const _Hi = ({name, count}: any, renderer: any)  => <fragment>{hi()} {name}!!! [{count}]</fragment>

// Client-Side component:
export function Hellow({name}: any, renderer: any) {
  const count = state(0);

  return <div onclick={() => count.value += 1}><_Hi name={name} count={count}/></div>
}

// Transport component:
export const $Hellow = transport(Hellow);

// Server-Side component:
export function SHellow({name}: any, renderer: any) {
  return <div><_Hi name={name} count={0}/></div>
}

// SD Component (so renders SSR version and swaps it with CS):
export function SDHellow({name}: any, renderer: any) {
  const tr = transportRef();

  return <fragment>
    <SHellow name={name} _transport={tr}/>
    <$Hellow name={name} _transport={tr}/>
  </fragment>
}
