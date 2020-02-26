import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { wrap, pipe } from '@connectv/core';
import { compile, StaticRenderer } from '../src/static';


// const to = (ms: number) => new Promise(resolve => setTimeout(() => resolve(), ms));
const id = (x: any) => wrap(of(x)).to(pipe(delay(1000)));


const MyComp = ({ name }: any, renderer: StaticRenderer) => <div>Hellow {id(name)}!!!</div>;

compile(renderer =>
  <html>
    <head>
      <title>TEST!</title>
    </head>
    <body>
      <MyComp name='World'></MyComp>
    </body>
  </html>
)
.save('index.html', 'dist');
