import { isFunction } from '../../../utils';
import Dragger from '../../../Dragger';
import Container from '../../../Container';
import { Effect } from '../../../../../types';

export default class EffectsManager {
  private dragger: Dragger;
  private impactContainer: Container;
  public id: string;
  public impactDraggerEffects: Effect[];
  public impactContainerEffects: Effect[];
  public upstreamDraggersEffects: Effect[];
  public downstreamDraggersEffects: Effect[];

  constructor({
    dragger,
    impactContainer,
  }: {
    dragger: Dragger;
    impactContainer: Container;
  }) {
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
