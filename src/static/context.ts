import { PropsType, CTX, 
         PluginPriority, PluginHost, 
         CompType, CompProcessPlugin, 
         isCompContextPlugin, isDefaultReactiveRecipientPlugin,
         UnhandledComponentContextError
} from '@connectv/html';
import { Subscription } from 'rxjs';

import { whenRendered, getLSMarker, WRCallbackHighPriority } from '../shared/lifecycle';


export class ContextPlugin<R, T> implements CompProcessPlugin<R, T> {
    prepare(
      _: CompType<RawValue | R, T>,
      __: PropsType<R | RawValue>,
      ___: (RawValue | R | Node)[],
      extras: { [name: string]: any; },
      pluginHost: PluginHost<R, T>,
    ): (node: Node) => void {

      let _plugin = pluginHost.plugins.find(isDefaultReactiveRecipientPlugin);
      let _default = () => _plugin?_plugin.defaultContext():undefined;

      const map: {[key: string]: any} = {};
      const context = <T>(key: string, recipient?: T): T => map[key] = map[key] || recipient || _default();
      extras.context = context;

      return (node: Node) => {
        const sub = new Subscription();
        const _ctxPlugins = pluginHost.plugins.filter(isCompContextPlugin);

        whenRendered(node, () => {
          let _ref = node;
          if (node instanceof DocumentFragment) _ref = getLSMarker(node);

          const ctx = CTX.resolve(_ref, Object.keys(map));
          Object.entries(map).forEach(([key, recipient]) => {
            const value = ctx[key];
            if (!_ctxPlugins.find(p => p.wireContext(key, value, recipient, sub, _ref, pluginHost)))
              throw new UnhandledComponentContextError(key, recipient, value);
          });
        }, WRCallbackHighPriority);
      }
    }

  priority = PluginPriority.High;
}
