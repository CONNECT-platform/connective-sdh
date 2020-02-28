import { DefaultPinLikeRecipientPlugin } from '@connectv/html';

import { PinPlugin } from './pin';
import { PinInnerHTMLPlugin } from './pin-inner-html';
import { PinClassPlugin } from './pin-class';
import { CompInputPinPlugin } from './comp-input-pin';


export function pinPlugins<R, T>() {
  return [
    new PinPlugin<R, T>(),
    new PinInnerHTMLPlugin<R, T>(),
    new PinClassPlugin<R, T>(),
    new CompInputPinPlugin<R, T>(),
    new DefaultPinLikeRecipientPlugin<R, T>(),
  ]
}
