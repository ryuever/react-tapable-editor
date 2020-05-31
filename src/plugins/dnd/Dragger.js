import { draggerKeyExtractor } from "./key";

class Dragger {
  constructor(el) {
    this.container = null;
    this.el = el;
    this._teardown = null;
    this.id = draggerKeyExtractor();
  }

  teardown() {
    if (!this.container) return;
    if (typeof this._teardown === "function") this._teardown();
  }
}

export default Dragger;
