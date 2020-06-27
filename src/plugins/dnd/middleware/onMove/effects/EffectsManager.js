import { isFunction } from "../../../utils";

export default class EffectsManager {
  constructor({ dragger, impactContainer }) {
    this.dragger = dragger;
    this.impactContainer = impactContainer;
    this.id = impactContainer.id;

    this.impactDraggerEffects = [];
    this.impactContainerEffects = [];
    this.upstreamDraggersEffects = [];
    this.downstreamDraggersEffects = [];
  }

  get isHomeContainerEffects() {
    const { container } = this.dragger;
    return container.id === this.impactContainer.id;
  }

  assertRun(fn) {
    if (isFunction(fn)) fn();
  }

  clearImpactContainerEffects() {
    this.impactContainerEffects.forEach(({ teardown }) =>
      this.assertRun(teardown)
    );
    this.impactContainerEffects = [];
  }

  clearImpactDraggerEffects() {
    this.impactDraggerEffects.forEach(({ teardown }) =>
      this.assertRun(teardown)
    );
    this.impactDraggerEffects = [];
  }

  clearDownstreamEffects() {
    this.downstreamDraggersEffects.forEach(({ teardown }) =>
      this.assertRun(teardown)
    );
    this.downstreamDraggersEffects = [];
  }

  clearUpstreamEffects() {
    this.upstreamDraggersEffects.forEach(({ teardown }) =>
      this.assertRun(teardown)
    );
    this.upstreamDraggersEffects = [];
  }

  teardown() {
    this.clearImpactContainerEffects();
    this.clearImpactDraggerEffects();
    this.clearUpstreamEffects();
    this.clearDownstreamEffects();
  }
}
