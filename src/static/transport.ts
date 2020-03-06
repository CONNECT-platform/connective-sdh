import { CompPropPlugin, PluginPriority } from '@connectv/html';


export class TransportPlugin<R, T> implements CompPropPlugin<R, T> {
  priority = PluginPriority.High;

  wireProp(name: string, prop: string, host: Node) {
    if (name === '_transport' && host instanceof HTMLElement) {
      host.setAttribute('data-transport', prop);
      return true;
    }

    return false;
  }
}
