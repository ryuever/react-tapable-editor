import { draggerKeyExtractor } from './key';
import Container from './Container';
import { DraggerDimension } from '../../types';

class Dragger {
  public id: string;
  public container: Container;
  public el: HTMLElement;
  public _teardown: { (): void } | null;
  public dimension: DraggerDimension;

  constructor({ el, container }: { el: HTMLElement; container: Container }) {
    this.container = container;
    this.el = el;
    this._teardown = null;
    this.id = draggerKeyExtractor();
    this.dimension = {} as DraggerDimension;
  }

  teardown() {
    if (!this.container) return;
    if (typeof this._teardown === 'function') this._teardown();
  }
}

export default Dragger;
