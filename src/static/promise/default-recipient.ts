import { DefaultReactiveRecipientPlugin } from '@connectv/html';

import { recipientPromise } from './recipient-promise';


export class DefaultPromiseRecipientPlugin<R, T>
  extends DefaultReactiveRecipientPlugin<R, T> {
  defaultContext() { return recipientPromise(); }
  defaultInput() { return recipientPromise(); }
  defaultOutput() { throw new Error("Component outputs not supported in server-side rendering."); }
  defaultState() { throw new Error("Component states not supported in server-side rendering."); }
}
