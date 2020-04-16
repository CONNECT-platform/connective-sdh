import { join, dirname } from 'path';

import { Bundle } from './bundle';
import { TransportInfo } from './transport';


function extractModule(_import: TransportInfo): [TransportInfo, string | undefined] {
  const match = /(^.*\/node_modules\/(?:(?:\w+\/)|(?:\@\w+\/\w+\/)))/.exec(_import.filename);
  if (match) return [_import, match[1]];
  else return [_import, undefined];
}


export function modularize(bundle: Bundle) {
  const modules: {[module: string]: TransportInfo[]} = {};
  [
    ...bundle.imports,
    ...bundle.initImports,
    ...(bundle.rendererImport ? [bundle.rendererImport] : [])
  ].map(extractModule)
   .filter(([_import, module]) => !!module)
   .forEach(([_import, _module]) => {
     const module = _module as string;
     (modules[module] = modules[module] || []).push(_import);
   });

  Object.entries(modules).forEach(([mod, imports]) => {
    try {
      const pkg = require(join(mod, 'package.json'));
      if (pkg && pkg.module && pkg.main && pkg.sdhTransport && pkg.sdhTransport === 'module') {
        const main = dirname(join(mod, pkg.main));
        const module = dirname(join(mod, pkg.module));
        imports.forEach(i => {
          if (i.filename.startsWith(main)) {
            i.filename = join(module, i.filename.substr(main.length));
          }
        })
      }
    } catch (_) {}
  });

  return bundle;
}
