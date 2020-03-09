import { compile } from '../src/static';
import { Bundle } from '../src/dynamic/bundle';
import { save, load } from '../src/dynamic/presistence';

import { $Hellow } from './comp';
import { SDHellow } from './comp2';

import { factoryTransport } from './renderer';

// --> this builds bundleA. it is commented because bundleA is already
// --> built and we want to load it (uncomment it if you need to build it).
// const bundleA = new Bundle('./bundleA.js', './dist/bundleA.js');
(async() => {

// --> comment this line if you need to build bundleA.
const bundleA = await load('./dist/bundleA.js', './bundleA.js');

const bundleB = new Bundle('./bundleB.js', './dist/bundleB.js').withRenderer(factoryTransport);

// --> this is commented because we are pre-loading bundleA.
// --> uncomment it in case you need to build it.
// const bundleA = new Bundle('./bundleA.js', './dist/bundleA.js');
// bundleA.collect($Hellow);

compile(renderer =>
  <html>
    <head>
      <title>TEST!</title>
    </head>
    <body>
      This is my stuff:
      <$Hellow name='World'/>
      <br/><hr/><br/>
      also
      <SDHellow name='Jack'/>
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