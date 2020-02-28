import { ObservablePlugin } from './observable';
import { ObservableInnerHTMLPlugin } from './observable-inner-html';
import { ObservableClassPlugin } from './observable-class';
import { CompInputSubjectPlugin } from './comp-input-subject';


export function observablePlugins<R, T>() {
  return [
    new ObservablePlugin<R, T>(),
    new ObservableInnerHTMLPlugin<R, T>(),
    new ObservableClassPlugin<R, T>(),
    new CompInputSubjectPlugin<R, T>(),
  ]
}
