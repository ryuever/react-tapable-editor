import ContainerEffects from './ContainerEffects';

export default class ContainersEffects {
  constructor() {
    this.children = {};
  }

  find(id) {
    return this.children[id];
  }

  add(containerEffects) {
    const { id } = containerEffects;
    this.children[id] = containerEffects;
    return () => {
      delete this.children[id];
    };
  }

  remove(containerEffects) {
    const { id } = containerEffects;
    if (this.children[id]) {
      this.children[id].teardown();
      delete this.children[id];
    }
  }

  teardown() {
    for (const id in children) {
      const child = children[id];
      child.teardown();
    }
  }

  partialTeardown() {
    for (const id in children) {
      const child = children[id];
      if (!child.isHomeContainerEffects) child.teardown();
    }
  }
}
