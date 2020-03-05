import { compile } from '../src/static';
import { Bundle } from '../src/dynamic/bundle';
import { save, load } from '../src/dynamic/presistence';

import { $Hellow } from './comp';
import { $Hellow2 } from './comp2';


// const bundleA = new Bundle('./bundleA.js', './dist/bundleA.js');
(async() => {

const bundleA = await load('./dist/bundleA.js', './bundleA.js');
const bundleB = new Bundle('./bundleB.js', './dist/bundleB.js');

// bundleA.collect($Hellow);

compile(renderer =>
  <html>
    <head>
      <title>TEST!</title>
    </head>
    <body>
      This is my stuff:
      <$Hellow name='World'></$Hellow>
      <br/><hr/><br/>
      also
      <$Hellow2 name='Jack'></$Hellow2>
    </body>
  </html>
)
.post(bundleA.resolve())
.post(bundleB.collect())
.save('index.html', 'dist')
.then(async () => {
  save(bundleA);
  save(bundleB);
});

})();