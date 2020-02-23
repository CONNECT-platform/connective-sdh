import { compile, StaticRenderer } from '../src/static';


const to = (ms: number) => new Promise(resolve => setTimeout(() => resolve(), ms));
const id = async (x: any, renderer: any) => {
  await to(1000);
  return <span>{x}</span>;
}


const MyComp = ({ name }: any, renderer: StaticRenderer) => <div>Hellow {id(name, renderer)}!!!</div>;

compile((body, head, renderer) => {
  head(
    <title>TEST!</title>
  );
  body(
    <MyComp name='World'></MyComp>
  );
})
.toFile('index.html', 'dist');
