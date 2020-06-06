import { containerKeyExtractor } from "./key";

class Container {
  constructor({ el, containers, dndConfig }) {
    this.el = el;
    this.id = containerKeyExtractor();
    this.containers = containers;
    this.children = [];
    this.dndConfig = dndConfig;

    this.containers[this.id] = this;
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

  cleanup() {
    delete this.containers[this.id];
  }
}

export default Container;
