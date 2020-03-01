import { DefaultReactiveRecipientPlugin } from '@connectv/html';

import { inputPromise } from './comp-input-promise';


export class DefaultPromiseRecipientPlugin<R, T>
  extends DefaultReactiveRecipientPlugin<R, T> {
  defaultContext() { return inputPromise(); }
  defaultInput() { return inputPromise(); }
  defaultOutput() { throw new Error("Component outputs not supported in server-side rendering."); }
  defaultState() { throw new Error("Component states not supported in server-side rendering."); }
}
