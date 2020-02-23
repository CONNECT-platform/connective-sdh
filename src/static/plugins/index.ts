import { PromisePlugin } from "./promise";


export function promisePlugins<R, T>() {
  return [
    new PromisePlugin<R, T>(),
  ]
}
