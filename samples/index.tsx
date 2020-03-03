import { of, Subject } from 'rxjs';
import { delay, map as _map } from 'rxjs/operators';
import { Context } from '@connectv/html';
import { wrap, pipe, Pin, map } from '@connectv/core';
import { compile, StaticRenderer, ComponentThis } from '../src/static';
import { recipientPromise } from '../src/static/promise';


const id = (x: any) => wrap(of(x)).to(pipe(delay(1000)));
// const id = (x: any) => new Promise(resolve => setTimeout(() => resolve(x), 1000));
// const id = (x: any) => of(x).pipe(delay(1000));
// const id = (x: any) => x;


function MyComp(this: ComponentThis, _: any, renderer: StaticRenderer) {
  const name = this.context('name');
  // const name = this.expose.in('name');
  return <div>Hellow {name.to(map((x: string) => x + '!!!!'))}</div>;
}

compile(renderer =>
  <html>
    <head>
      <title>TEST!</title>
    </head>
    <body>
      <Context name={id('World')}>
        <MyComp></MyComp>
      </Context>
    </body>
  </html>
)
.serialize()
.then(console.log)
// .save('index.html', 'dist');
