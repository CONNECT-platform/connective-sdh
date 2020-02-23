import { Compiler, StaticRenderer } from '../src/static';

const compiler = new Compiler();

const MyComp = ({ name }: any, renderer: StaticRenderer) => <div>Hellow {name}</div>;

compiler.compile((body, head, renderer) => {
  head(
    <title>TEST!</title>
  );
  body(
    <MyComp name='world'></MyComp>
  );
}).then(console.log);
