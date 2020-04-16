import { compile, save, Bundle, load } from '../src';
import { $Counter } from './counter';
import { $initA } from './initA';
import { $initB } from './initB';

import { Buttons$ } from '@test/pkg';


(async() => {
  const bundle = new Bundle('./bundle.js', './dist/bundle.js');
  // const bundle = await load('./dist/bundle.js', './bundle.js');

  compile(renderer =>
    <fragment>
      <p>
        So this content will be prerendered, but the following component will be
        rendered on the client side.
      </p>
      <Buttons$>Halo</Buttons$>
      <$Counter/>
    </fragment>
  )
  .post(bundle.collect())                    // --> collect all necessary dependencies in the bundle
  .save('dist/index.html')
  .then(() => {
    bundle.init($initA).init($initB);
    save(bundle, {mode: 'development'});     // --> build the bundle and store it on fs
  });
})()

