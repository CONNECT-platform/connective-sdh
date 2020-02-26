import { ObservablePlugin } from "./observable";


export function observablePlugins<R, T>() {
  return [
    new ObservablePlugin<R, T>(),
  ]
}
