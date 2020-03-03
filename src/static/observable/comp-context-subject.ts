import { Observable, Subject, from, of } from 'rxjs';
import { isPinLike } from '@connectv/core';
import { CompContextPlugin, PluginPriority } from '@connectv/html';


export class CompContextSubjectPlugin<R, T> implements CompContextPlugin<R, T> {
  wireContext(_: string, value: any, recipient: any, __: any) {
    if (recipient instanceof Subject) {
      if (isPinLike(value)) value.subscribe(recipient);
      else if (value instanceof Observable) value.subscribe(recipient);
      else if (value instanceof Promise) from(value).subscribe(recipient);
      else of(value).subscribe(recipient);

      return true;
    }

    return false;
  }

  priority = PluginPriority.High;
}
