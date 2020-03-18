import { CompType, RendererLike } from '@connectv/html';

import { StaticRenderer } from '../static';

import { TransportInfo, fetchInfo } from './transport/transport-info';
import { getCompTransportInfo } from './transport/transport';
import { TransportedFunc, getFuncTransportInfo } from './transport/func-transport';


/**
 *
 * Denotes different bundle processing modes. A bundle processing mode
 * determines how a bundle reacts to transport dependencies of given
 * `HTMLDocument`:
 *
 */
export enum ProcessingMode { 
  /**
   *
   * In this mode, unresolved dependencies of the document are checked.
   * If they appear in the bundle, they are marked as resolved, and the bundle
   * will be added to the header of the document.
   *
   */
  ResolveOnly,

  /**
   *
   * In this mode, unresolved dependencies of the document are checked,
   * if they appear in the bundle, they are marked as resolved, otherwise
   * they will be added to the bundle, and the bundle added to the header
   * of the document. Processing in this mode might require the bundle
   * to be reconstructed.
   *
   */
  ResolveAndCollect 
}


/**
 *
 * Represents a bundle containing bundled code for components that need to be 
 * transported and executed on client side. A bundle is mainly denoted
 * by the URL it will be accessible on (from client's perspective) and the
 * server-side imports necessary to construct/reconstruct it.
 *
 */
export class Bundle {
  /**
   *
   * List of all server-side imports necessary to construct/reconstruct this bundle.
   *
   */
  imports: TransportInfo[];

  /**
   * 
   * _Optional_, the custom renderer factory import in case the bundle is to use
   * a custom client-side renderer for rendering transport components.
   * 
   */
  rendererImport: TransportInfo | undefined;

  /**
   * 
   * _Optional_, the custom init scripts to be executed when the bundle
   * is loaded in the client-side.
   * 
   */
  initImports: TransportInfo[];

  /**
   *
   * The path of the file the bundle is stored on (or is to be stored on).
   * If not provided, will be the same as `.url`.
   *
   */
  path: string;

  /**
   *
   * Whether the bundle should be reconstructed or not.
   *
   */
  repack: boolean = true;

  /**
   *
   * @param url  the URL on which the bundle will be accessible to clients.
   * @param path the path of the file the bundle is stored on. defaults to the URL.
   *
   */
  constructor(readonly url: string, path?: string) {
    this.imports = [];
    this.initImports = [];
    this.path = path || this.url;
  }

  /**
   *
   * @param info 
   * @returns `true` if the bundle includes given server-side import.
   *
   */
  includes(info: TransportInfo) { return this.imports.some(i => i === info || i.hash === info.hash); }

  /**
   * 
   * @param info a new server-side import to be added to this bundle.
   * @returns `this` for chaining convenience.
   * @warning This function DOES NOT check whether given import is already part of the bundle or not.
   * Avoid using it directly unless you know what you are doing.
   *
   */
  add(info: TransportInfo) {
    this.imports.push(info);
    this.repack = true;
    return this;
  }

  /**
   * 
   * @returns a `PostProcessor` that processes given `HTMLDocument` in `ResolveAndCollect` mode.
   * This means that unresolved dependencies of given document will be checked, if they are part of the
   * bundle they will be marked as resolved, and if not, they will be added to the bundle (in which
   * case the bundle needs to be reconstructed). In both cases, the bundle will be added
   * to the document's header (via a `<script/>` tag with the bundle's URL).
   * 
   */
  collect(): (document: HTMLDocument) => void;

  /**
   *
   * Adds necessary server-side imports for given transport components to this bundle.
   * Components passed to this function MUST BE transport components, i.e. generated
   * using `transport()` method.
   *
   * @returns `this` for chaining convenience.
   * @see transport()
   *
   */
  collect(comp: CompType<any, any>, ...rest: CompType<any, any>[]): this;
  collect(...comps: CompType<any, any>[]) {
    comps.forEach(comp => {
      const info = getCompTransportInfo(comp);
      if (info && !this.includes(info)) this.add(info);
    });

    return comps.length == 0 ? this.process(ProcessingMode.ResolveAndCollect) : this;
  }

  /**
   *
   * @returns a `PostProcessor` that processes given `HTMLDocument` in `ResolveOnly` mode.
   * This means that unresolved dependencies of the given document will be checked, if they
   * are part of the bundle they will be marked as resolved and the bundle will be added to the
   * document's header (via a `<script/>` tag with the bundle's URL).
   *
   */
  resolve() { return this.process(ProcessingMode.ResolveOnly); }

  /**
   *
   * @param mode 
   * @returns a `PostProcessor` that processes given `HTMLDocument` using given mode.
   * @see Bundle.resolve()
   * @see Bundle.collect()
   *
   */
  process(mode: ProcessingMode) {
    const renderer = new StaticRenderer();
    return (document: HTMLDocument) => {
      let used = false;
      fetchInfo(document).forEach(info => {
        if (!info.resolved) {
          if (this.includes(info)) info.resolved = used = true;
          else if (mode === ProcessingMode.ResolveAndCollect) {
            this.add(info);
            info.resolved = used = true;
          }
        }
      });

      if (used) renderer.render(<script src={this.url}></script>).on(document.head);
    }
  }

  /**
   *
   * Will set the client-side renderer used by the bundle to given
   * renderer factory. Useful for using custom client-side renderers.
   *
   * @param factory the factory function to be transported. MUST BE result of `funcTransport()` function.
   * @returns `this` for chaining convenience.
   *
   */
  withRenderer<R, T>(factory: TransportedFunc<RendererLike<R, T>>) {
    const _rendererImport = getFuncTransportInfo(factory);
    if (_rendererImport) {
      if (!this.rendererImport || this.rendererImport && this.rendererImport.hash !== _rendererImport.hash) {
        this.rendererImport = _rendererImport;
        this.repack = true;
      }
    }

    return this;
  }

  /**
   *
   * Will add the given init-function to initialization functions of this bundle.
   * These functions will be executed when the bundle is loaded on the client-side.
   *
   * @param initFunc the initialization function to be transported. MUST BE result of `funcTransport()` function.
   * @returns `this` for chaining convenience.
   *
   */
  init(initFunc: TransportedFunc<void>) {
    const _import = getFuncTransportInfo(initFunc);
    if (!this.initImports.some(i => i.hash === _import.hash)) {
      this.initImports.push(_import);
      this.repack = true;
    }

    return this;
  }
}
