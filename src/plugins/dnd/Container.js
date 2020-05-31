import { containerKeyExtractor } from "./key";

class Container {
  constructor({ el }) {
    this.el = el;
    this.id = containerKeyExtractor();

    this.children = [
      {
        containerId: "",
        draggerId: "",
        cleanup: () => {}
      }
    ];
  }

  // used for transition
  addDirectChild(dragger) {
    this.children.push(dragger);
    dragger._teardown = () => {
      const index = this.children.findIndex(child => child === dragger);
      if (index !== -1) this.children.splice(index, 1);
    };
  }
}

export default Container;
