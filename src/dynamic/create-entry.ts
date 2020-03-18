import { writeFile } from 'rxline/fs';

import { TransportInfo } from './transport/transport-info';


interface NormalizedTransportInfo extends TransportInfo {
  ogname: string;
}


function normalize(imports: TransportInfo[]) {
  const nameCounter = <{[name: string]: number}>{};
  const res: NormalizedTransportInfo[] = [];

  imports.forEach(i => {
    const ni = {...i, ogname: i.name};
    if (ni.name in nameCounter) ni.name = ni.name + nameCounter[ni.name];
    nameCounter[ni.name] = (nameCounter[ni.name] || 0) + 1;

    res.push(ni);
  });

  return res;
}


function normalImport(info: NormalizedTransportInfo) {
  return `import { ${(info.ogname !== info.name)?`${info.ogname} as ${info.name}`:info.name} } from '${info.filename}';`
}


export function createEntry(path: string, 
    imports: TransportInfo[], 
    rendererImport?: TransportInfo, 
    initImports?: TransportInfo[]
  ) {

  const normal = normalize(imports);
  const initNormal = normalize(initImports || []);

  const factory = {
    _import: {
      _artifact: 'Renderer',
      _ref: '@connectv/html'
    },
    _code: 'const renderer = new Renderer();',
  };

  if (rendererImport) {
    factory._import = {
      _artifact: rendererImport.name,
      _ref: rendererImport.filename,
    };

    factory._code = `const renderer = ${factory._import._artifact}();`
  }

  return writeFile()({ root: '', path, content: `import { ${factory._import._artifact} } from '${factory._import._ref}';
${initNormal.map(info => normalImport(info) + `${info.name}();`).join('\n')}
${normal.map(normalImport).join('\n')}

const components = {
${normal.map(info => `  '${info.hash}': ${info.name}`).join(',\n')}
};

${factory._code}
const ogtransport = window.__sdh_transport;
window.__sdh_transport = function(id, hash, props) {
  if (hash in components) {
    const target = document.getElementById(id);
    renderer.render(renderer.create(components[hash], props)).after(target);
    target.remove();
  }
  else if (ogtransport) ogtransport(id, hash, props);
}
`
  });
}
