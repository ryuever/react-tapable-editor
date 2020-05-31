import { containerKeyExtractor } from "./key";

class Container {
  constructor({ el }) {
    this.el = el;
    this.id = containerKeyExtractor();

    this.children = [];
  }

  // used for transition
  addDirectChild(dragger) {
    this.children.push(dragger);
    dragger.container = this;
    dragger._teardown = () => {
      const index = this.children.findIndex(child => child === dragger);
      if (index !== -1) this.children.splice(index, 1);
    };
  }
}

export default Container;
