import { of  } from 'rxjs';
import { delay, map as _map } from 'rxjs/operators';
import { Context } from '@connectv/html';
import { wrap, pipe } from '@connectv/core';

import { compile } from '../src/static';
import { Bundle, ProcessingMode } from '../src/dynamic/bundle';

import { $Hellow } from './comp';
import { $Hellow2 } from './comp2';


const id = (x: any) => wrap(of(x)).to(pipe(delay(1000)));
// const id = (x: any) => new Promise(resolve => setTimeout(() => resolve(x), 1000));
// const id = (x: any) => of(x).pipe(delay(1000));
// const id = (x: any) => x;

const bundleA = new Bundle('./bundleA.js');
const bundleB = new Bundle('./bundleB.js');

bundleA.collect($Hellow);

compile(renderer =>
  <html>
    <head>
      <title>TEST!</title>
    </head>
    <body>
      This is my stuff:
      <$Hellow name={id('World')}></$Hellow>
      <br/><hr/><br/>
      also
      <$Hellow2 name={id('Jack')}></$Hellow2>
    </body>
  </html>
)
.post(bundleA.resolve())
.post(bundleB.collect())
.save('index.html', 'dist')
.then(() => {
  bundleA.pack('./dist/bundleA.js');
  bundleB.pack('./dist/bundleB.js');
});
