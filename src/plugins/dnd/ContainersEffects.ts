import ContainerEffects from './ContainerEffects';

export default class ContainersEffects {
  private children: {
    [key: string]: ContainerEffects;
  };

  constructor() {
    this.children = {};
  }

  find(id: string) {
    return this.children[id];
  }

  add(containerEffects: ContainerEffects) {
    const { id } = containerEffects;
    this.children[id] = containerEffects;
    return () => {
      delete this.children[id];
    };
  }

  remove(containerEffects: ContainerEffects) {
    const { id } = containerEffects;
    if (this.children[id]) {
      this.children[id].teardown();
      delete this.children[id];
    }
  }

  teardown() {
    for (const id in this.children) {
      const child = this.children[id];
      child.teardown();
    }
  }

  partialTeardown() {
    for (const id in this.children) {
      const child = this.children[id];
      if (!child.isHomeContainerEffects) child.teardown();
    }
  }
}
