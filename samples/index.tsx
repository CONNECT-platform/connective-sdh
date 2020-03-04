import { of  } from 'rxjs';
import { delay, map as _map } from 'rxjs/operators';
import { Context } from '@connectv/html';
import { wrap, pipe } from '@connectv/core';

import { compile } from '../src/static';

import { $Hellow } from './comp';


const id = (x: any) => wrap(of(x)).to(pipe(delay(1000)));
// const id = (x: any) => new Promise(resolve => setTimeout(() => resolve(x), 1000));
// const id = (x: any) => of(x).pipe(delay(1000));
// const id = (x: any) => x;

compile(renderer =>
  <html>
    <head>
      <title>TEST!</title>
    </head>
    <body>
      This is my stuff:
      <$Hellow name='World'></$Hellow>
    </body>
  </html>
)
.serialize()
.then(console.log)
// .save('index.html', 'dist');