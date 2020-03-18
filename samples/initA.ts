import { funcTransport } from '../src/dynamic/transport';

export function init() {
  console.log('INIT A');
}

export const $initA = funcTransport(init);
