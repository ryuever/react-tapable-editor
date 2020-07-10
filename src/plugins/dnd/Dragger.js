import { draggerKeyExtractor } from './key';

class Dragger {
  constructor({ el, container }) {
    this.container = container;
    this.el = el;
    this._teardown = null;
    this.id = draggerKeyExtractor();
    this.dimension = {};
  }

  teardown() {
    if (!this.container) return;
    if (typeof this._teardown === 'function') this._teardown();
  }
}

export default Dragger;
