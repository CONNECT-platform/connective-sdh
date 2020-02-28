import { Observable } from 'rxjs';
import { wrap, control, map, value, isPinLike } from '@connectv/core';
import { PluginPriority, ComponentSignature, CompPropPlugin } from '@connectv/html';


export class CompInputPinPlugin<R, T> implements CompPropPlugin<R, T> {
  wireProp(name: string, prop: any, _: Node, signature: ComponentSignature) {
    if (signature.inputs && name in signature.inputs && isPinLike(signature.inputs[name])) {
      const input = signature.inputs[name];

      if (prop instanceof Observable) wrap(prop).to(input);
      else if (isPinLike(prop)) prop.to(input);
      else if (prop instanceof Promise) control().to(map((_, done) => prop.then(done))).to(input);
      else value(prop).to(input);

      return true;
    }

    return false;
  }

  priority = PluginPriority.High;
}
