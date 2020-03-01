import { of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { wrap, pipe, Pin, map } from '@connectv/core';
import { compile, StaticRenderer, ComponentThis } from '../src/static';
import { CompInputPromise } from '../src/static/promise';
import { inputPromise } from '../src/static/promise/comp-input-promise';


const id = (x: any) => wrap(of(x)).to(pipe(delay(1000)));
// const id = (x: any) => new Promise(resolve => setTimeout(() => resolve(x), 1000));
// const id = (x: any) => of(x).pipe(delay(1000));
// const id = (x: any) => x;


function MyComp(this: ComponentThis, _: any, renderer: StaticRenderer) {
  const name = this.expose.in('name', inputPromise<string>());
  return <div>Hellow {name.then(x => x + '!!!!')}</div>;
}

compile(renderer =>
  <html>
    <head>
      <title>TEST!</title>
    </head>
    <body>
      <MyComp name={id('World')}></MyComp>
    </body>
  </html>
)
.serialize()
.then(console.log);
// .save('index.html', 'dist');
