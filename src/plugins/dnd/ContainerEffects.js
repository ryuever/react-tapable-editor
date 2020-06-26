import { isFunction } from "./utils";

export default class ContainerEffects {
  constructor({ dragger, impactContainer }) {
    this.dragger = dragger;
    this.impactContainer = impactContainer;
    this.id = impactContainer.id;

    this.impactDraggerEffects = [];
    this.impactDragger = null;

    this.impactContainerEffects = [];
    this.impactContainer = null;

    this.upstreamDraggersEffects = [];
    this.upstreamDraggers = [];

    this.downstreamDraggersEffects = [];
    this.downstreamDraggers = [];
  }

  get isHomeContainerEffects() {
    const { container } = this.dragger;
    return container.id === this.impactContainer.id;
  }

  assertRun(fn) {
    if (isFunction(fn)) fn();
  }

  clearDownstream() {
    this.downstreamDraggersEffects.forEach(({ teardown }) =>
      this.assertRun(teardown)
    );
  }

  clearUpstream() {
    this.upstreamDraggersEffects.forEach(({ teardown }) =>
      this.assertRun(teardown)
    );
  }

  clearDragger() {
    this.impactDraggerEffects.forEach(({ teardown }) =>
      this.assertRun(teardown)
    );
  }

  clearContainer() {
    this.impactContainerEffects.forEach(({ teardown }) =>
      this.assertRun(teardown)
    );
  }

  teardown() {
    this.clearContainer();
    this.clearDragger();
    this.clearUpstream();
    this.clearDownstream();
  }
}
