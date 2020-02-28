import { DefaultReactiveRecipientPlugin } from '@connectv/html';

import { CompInputPromise } from './comp-input-promise';


export class DefaultPromiseRecipientPlugin<R, T>
  extends DefaultReactiveRecipientPlugin<R, T> {
  defaultContext() { return new CompInputPromise(); }
  defaultInput() { return new CompInputPromise(); }
  defaultOutput() { throw new Error("Component outputs not supported in server-side rendering."); }
  defaultState() { throw new Error("Component states not supported in server-side rendering."); }
}
