import { join, parse, resolve } from 'path';
import webpack from 'webpack';

import { StaticRenderer } from '../static';

import { TransportInfo, fetchInfo } from './transport-info';
import { createEntry } from './create-entry';


export class Bundle {
  imports: TransportInfo[];
  path: string;
  entryPath: string;

  constructor(readonly url: string, path?: string) {
    this.imports = [];
    this.path = path || this.url;
  }

  process() {
    const renderer = new StaticRenderer();
    return (document: HTMLDocument) => {
      renderer.render(<script src={this.url}></script>).on(document.head);
      fetchInfo(document).forEach(info => {
        if (!this.imports.some(i => i === info || i.hash === info.hash))
          this.imports.push(info);
      });
    }
  }

  async bootstrap(path?: string) {
    if (path) this.path = path;

    const { dir, name } = parse(this.path);
    this.entryPath = join(dir, name + '.entry.js');

    return createEntry(this.entryPath, this.imports);
  }

  async pack(path?: string) {
    await this.bootstrap(path);
    const { dir, name, ext } = parse(this.path);

    webpack({
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          },
        ],
      },
      resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
      },
      resolveLoader: {
        modules: [
          'node_modules'
        ]
      },
      entry: './' + this.entryPath,
      output: {
        filename: name + ext,
        path: resolve(dir)
      }
    }, (err, res) => {
      console.log(res.toJson().errors);
    });
  }
}
