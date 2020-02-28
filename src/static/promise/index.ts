import { PromisePlugin } from "./promise";
import { PromiseInnerHTMLPlugin } from "./promise-inner-html";
import { PromiseClassPlugin } from "./promise-class";
import { CompInputPromisePlugin } from "./comp-input-promise";
import { DefaultPromiseRecipientPlugin } from "./default-recipient";


export function promisePlugins<R, T>() {
  return [
    new PromisePlugin<R, T>(),
    new PromiseInnerHTMLPlugin<R, T>(),
    new PromiseClassPlugin<R, T>(),
    new CompInputPromisePlugin<R, T>(),
    new DefaultPromiseRecipientPlugin<R, T>(),
  ]
}


export { CompInputPromise } from './comp-input-promise';
