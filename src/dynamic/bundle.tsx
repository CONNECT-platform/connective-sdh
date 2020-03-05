import { CompType } from '@connectv/html';

import { StaticRenderer } from '../static';

import { TransportInfo, fetchInfo } from './transport-info';
import { getCompTransportInfo } from './transport';


export enum ProcessingMode { ResolveOnly, ResolveAndCollect }

export class Bundle {
  imports: TransportInfo[];
  path: string;
  repack: boolean = true;

  constructor(readonly url: string, path?: string) {
    this.imports = [];
    this.path = path || this.url;
  }

  includes(info: TransportInfo) { return this.imports.some(i => i === info || i.hash === info.hash); }

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
      if (info && !this.includes(info)) this.add(info);
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
          if (this.includes(info)) info.resolved = true;
          else if (mode === ProcessingMode.ResolveAndCollect) {
            this.add(info);
            info.resolved = true;
          }
        }
      });
    }
  }
}
