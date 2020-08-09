import { isFunction } from '../../../utils';
import Dragger from '../../../Dragger';
import Container from '../../../Container';
import {
  ImpactDraggerEffect,
  DraggerEffect,
  ContainerEffect,
} from '../../../../../types';

export default class EffectsManager {
  private dragger: Dragger;
  private impactContainer: Container;
  public id: string;
  public impactDraggerEffects: ImpactDraggerEffect[];
  public impactContainerEffects: ContainerEffect[];
  public upstreamDraggersEffects: DraggerEffect[];
  public downstreamDraggersEffects: DraggerEffect[];

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

  isHomeContainerEffects() {
    const { container } = this.dragger;
    return container.id === this.impactContainer.id;
  }

  assertRun(fn: any) {
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
