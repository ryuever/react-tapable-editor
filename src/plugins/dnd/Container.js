import { containerKeyExtractor } from "./key";
import SortedItems from "./structure/SortedItems";
import { orientationToAxis, axisMeasure } from "./utils";

class Container {
  constructor({ el, containers, dndConfig }) {
    this.el = el;
    this.id = containerKeyExtractor();
    this.containers = containers;
    this.children = new SortedItems({
      sorter: this.sorter.bind(this)
    });
    this.dndConfig = dndConfig;

    this.containers[this.id] = this;
    this.dimension = {};
  }

  sorter(a, b) {
    const { orientation } = this.dndConfig;
    const axis = orientationToAxis[orientation];
    const [minProperty] = axisMeasure[axis];
    return a.dimension[minProperty] < b.dimension[minProperty];
  }

  // used for transition
  addDirectChild(dragger) {
    this.children.add(dragger);
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
