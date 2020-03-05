import { writeFile } from 'rxline/fs';

import { TransportInfo } from './transport-info';


interface NormalizedTransportInfo extends TransportInfo {
  ogname: string;
}


function normalize(imports: TransportInfo[]) {
  const names = <{[name: string]: number}>{};
  const res: NormalizedTransportInfo[] = [];

  imports.forEach(i => {
    const ni = {...i, ogname: i.name};
    if (ni.name in names) ni.name = ni.name + names[ni.name];
    names[ni.name] = (names[ni.name] || 0) + 1;

    res.push(ni);
  });

  return res;
}


export function createEntry(path: string, imports: TransportInfo[]) {
  const normal = normalize(imports);

  return writeFile()({ root: '', path, content: `import { Renderer } from '@connectv/html';

${normal.map(info => `import { ${(info.ogname !== info.name)?`${info.ogname} as ${info.name}`:info.name} } from '${info.filename}';`).join('\n')}

const components = {
${normal.map(info => `  '${info.hash}': ${info.name}`).join(',\n')}
};

const renderer = new Renderer();
window.__sdh_transport = function(id, hash, props) {
  const target = document.getElementById(id);
  renderer.render(renderer.create(components[hash], props)).after(target);
  target.remove();
}
`
  });
}
