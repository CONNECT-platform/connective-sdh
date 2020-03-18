![repo banner](https://raw.githubusercontent.com/CONNECT-platform/connective-sdh/master/repo-banner.svg?sanitize=true)


Easily build [JAMStack](https://jamstack.org) websites or server-run web-apps, using the same components and toolset for rendering the static content (server-side-rendered or prerendered) and dynamic content (client-side interactive/dynamic content).

### Example: Static HTML

```tsx
import { compile } from '@connectv/sdh';

compile(renderer => 
  <html>
    <head>
      <title>Hellow World Example</title>
    </head>
    <body>
      <h1>Hellow World!</h1>
    </body>
  </html>
).save('dist/index.html');
```
[► TRY IT!](https://codesandbox.io/s/connective-sdh-hellow-world-deom3)

### Example: Static HTML using Components

```tsx
// card.tsx

const style = `
  display: inline-block;
  vertical-align: top;
  padding: 8px;
  border-radius: 8px;
  margin: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
`;

export function Card({ title, text }, renderer) {
  return <div style={style}>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
}

```
```tsx
// main.tsx

import { compile } from '@connectv/sdh';
import { Card } from './card';

compile(renderer => 
  <fragment>
    <h1>List of stuff</h1>
    <Card title='🥕Carrots' text='they are pretty good for you.'/>
  </fragment>
).save('dist/index.html');
```
[► TRY IT!](https://codesandbox.io/s/connective-sdh-static-components-r3b8i)

### Example: Interactive content

```tsx
// counter.tsx

import { state } from "@connectv/core";
import { transport } from "@connectv/sdh/transport";

const style = `
  border-radius: 3px;
  background: #424242;
  cursor: pointer;
  padding: 8px;
  color: white;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .12);
`;

export function Counter(_, renderer) {
  const count = state(0);
  return (
    <div style={style} onclick={() => count.value++}>
      You have clicked {count} times!
    </div>
  );
}

export const $Counter = transport(Counter); // --> transports `Counter` to client-side
```
```tsx
// main.tsx

import { compile, save, Bundle } from '@connectv/sdh';
import { $Counter } from './counter';

const bundle = new Bundle('./bundle.js', 'dist/bundle.js');

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
.then(() => save(bundle))                  // --> build the bundle and store it on fs

```
[► TRY IT!](https://codesandbox.io/s/connective-sdh-interactive-example-cgfwf)

# Installation

```bash
npm i @connectv/sdh
```

NodeJS does not support JSX/TSX syntax on its own, so for enabling that you would need to use a transpiler such as
Typescript or Babel. You should then configure your transpiler to use `renderer.create` as its JSX factory:

#### For Typescript:
Add this to your `tsconfig.json` file:
```json
"compilerOptions": {
    "jsx": "react",
    "jsxFactory": "renderer.create"
}
```

#### For Babel ([plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)):
Add this to your Babel config:
```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "renderer.create"
    }]
  ]
}
```



