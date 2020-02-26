import { PinPlugin } from "./pin";


export function pinPlugins<R, T>() {
  return [
    new PinPlugin<R, T>(),
  ]
}
