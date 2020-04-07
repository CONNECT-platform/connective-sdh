import { state } from '@connectv/core';
import { transport } from '../src/dynamic/transport';

export function Counter(_: any, renderer: any) {
  const count = state(0);
  return <div onclick={() => count.value++}>You have clicked {count} times!</div>
}

export const $Counter = transport(Counter);
