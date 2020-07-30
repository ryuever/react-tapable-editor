import EffectsManager from './EffectsManager';

export default class DndEffects {
  private children: {
    [key: string]: EffectsManager;
  };

  constructor() {
    this.children = {};
  }

  find(id: string) {
    return this.children[id];
  }

  add(effectsManager: EffectsManager) {
    const { id } = effectsManager;
    this.children[id] = effectsManager;
    return () => {
      delete this.children[id];
    };
  }

  remove(effectsManager: EffectsManager) {
    const { id } = effectsManager;
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
      if (!child.isHomeContainerEffects()) child.teardown();
    }
  }
}
