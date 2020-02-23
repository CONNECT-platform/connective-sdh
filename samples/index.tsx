import { compile, StaticRenderer } from '../src/static';


const MyComp = ({ name }: any, renderer: StaticRenderer) => <div>Hellow {name}</div>;

compile((body, head, renderer) => {
  head(
    <title>TEST!</title>
  );
  body(
    <MyComp name='World!'></MyComp>
  );
}).toFile('index.html', 'dist');
