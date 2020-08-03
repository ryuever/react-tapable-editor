import { containerKeyExtractor } from './key';
import SortedItems from './structure/SortedItems';
import { orientationToAxis, axisMeasure } from './utils';
import Dragger from './Dragger';
import {
  ResultDNDConfig,
  ResultConfig,
  Containers,
  ContainerDimension,
} from '../../types';

class Container {
  public id: string;
  public el: HTMLElement;
  public containers: Containers;
  public children: SortedItems<Dragger>;
  public dndConfig: ResultDNDConfig;
  public containerConfig: ResultConfig;
  public dimension: ContainerDimension;
  public parentContainer: Container | null;

  constructor({
    el,
    containers,
    dndConfig,
    containerConfig,
  }: {
    el: HTMLElement;
    containers: Containers;
    dndConfig: ResultDNDConfig;
    containerConfig: ResultConfig;
  }) {
    this.el = el;
    this.id = containerKeyExtractor();
    this.containers = containers;
    this.children = new SortedItems<Dragger>({
      sorter: this.sorter.bind(this),
    });
    this.dndConfig = dndConfig;
    this.containerConfig = containerConfig;

    this.containers[this.id] = this;
    this.dimension = {} as any;
    this.parentContainer = null;
  }

  sorter(a: Dragger, b: Dragger): number {
    const { orientation } = this.containerConfig;
    const axis = orientationToAxis[orientation];
    const [minProperty] = axisMeasure[axis];
    const aValue = a.dimension![minProperty] || 0;
    const bValue = b.dimension![minProperty] || 0;
    return aValue - bValue;
  }

  // used for transition
  addDirectChild(dragger: Dragger) {
    this.children.add(dragger);
    dragger.container = this;
    dragger._teardown = () => {
      const index = this.children.findIndex(dragger);
      if (index !== -1) this.children.splice(index, 1);
    };
  }

  cleanup() {
    delete this.containers[this.id];
  }
}

export default Container;
