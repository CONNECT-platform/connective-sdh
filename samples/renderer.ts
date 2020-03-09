import { Renderer } from '@connectv/html';
import { rendererTransport } from '../src/dynamic/renderer-transport';


export function factory() { return new Renderer(); }

export const factoryTransport = rendererTransport(factory);
