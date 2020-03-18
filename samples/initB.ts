import { funcTransport } from '../src/dynamic/transport';

export function init() {
  console.log('INIT B');
}

export const $initB = funcTransport(init);