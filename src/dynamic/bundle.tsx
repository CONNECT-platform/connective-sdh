import { join, parse, resolve } from 'path';
import webpack from 'webpack';

import { StaticRenderer } from '../static';

import { TransportInfo, fetchInfo } from './transport-info';
import { createEntry } from './create-entry';
import { CompType } from '@connectv/html';
import { getCompTransportInfo } from './transport';


export enum ProcessingMode {
  ResolveOnly,
  ResolveAndCollect,
}


export class Bundle {
  imports: TransportInfo[];
  path: string;
  entryPath: string;

  private repack: boolean = true;

  constructor(readonly url: string, path?: string) {
    this.imports = [];
    this.path = path || this.url;
  }

  includes(info: TransportInfo) {
    return this.imports.some(i => i === info || i.hash === info.hash);
  }

  add(info: TransportInfo) {
    this.imports.push(info);
    this.repack = true;
    return this;
  }

  collect(): (document: HTMLDocument) => void;
  collect(comp: CompType<any, any>, ...rest: CompType<any, any>[]): this;
  collect(...comps: CompType<any, any>[]) {
    comps.forEach(comp => {
      const info = getCompTransportInfo(comp);
      if (info) {
        if (!this.includes(info)) this.add(info);
      }
    });

    return comps.length == 0 ? this.process(ProcessingMode.ResolveAndCollect) : this;
  }

  resolve() { return this.process(ProcessingMode.ResolveOnly); }

  process(mode: ProcessingMode) {
    const renderer = new StaticRenderer();
    return (document: HTMLDocument) => {
      renderer.render(<script src={this.url}></script>).on(document.head);
      fetchInfo(document).forEach(info => {
        if (!info.resolved) {
          const included = this.includes(info);
          if (included) {
            info.resolved = true;
          }
          else if (mode === ProcessingMode.ResolveAndCollect) {
            this.add(info);
            info.resolved = true;
          }
        }
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
    if (!this.repack) return;

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
