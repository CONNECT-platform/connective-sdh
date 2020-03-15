import { compile, save, Bundle } from '../src';
import { $Counter } from './counter';

const bundle = new Bundle('./bundle.js', './dist/bundle.js');

compile(renderer =>
  <fragment>
    <p>
      So this content will be prerendered, but the following component will be
      rendered on the client side.
    </p>
    <$Counter/>
  </fragment>
)
.post(bundle.collect())                    // --> collect all necessary dependencies in the bundle
.save('dist/index.html')
.then(() => {
  save(bundle);                            // --> build the bundle and store it on fs
});
