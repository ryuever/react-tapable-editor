import ContainerEffects from "../../../ContainerEffects";
import { isFunction } from "../../../utils";

/**
 * Create a `ContainerEffects` if it does not exist in `ContainersEffects`.
 */
export default ({ dragger }, ctx, actions) => {
  const { containersEffects, impact, prevImpact } = ctx;
  const { impactContainer: prevImpactContainer } = prevImpact;
  const { impactContainer } = impact;

  if (prevImpactContainer && !impactContainer) {
    containersEffects.partialTeardown();
  }

  if (impactContainer) {
    if (!containersEffects.find(impactContainer.id)) {
      const newItem = new ContainerEffects({
        dragger,
        impactContainer
      });
      newItem.remove = containersEffects.add(newItem);
    }
    if (prevImpactContainer && prevImpactContainer.id !== impactContainer.id) {
      containersEffects.remove(prevImpactContainer);
    }
  }

  if (impactContainer) {
    const effects = containersEffects.find(impactContainer.id);

    if (!prevImpactContainer || prevImpactContainer.id !== impactContainer.id) {
      const { containerConfig } = impactContainer;
      const { containerEffect } = containerConfig;

      if (isFunction(containerEffect)) {
        const teardown = containerEffect(impactContainer.el);
        effects.impactContainerEffects.push({
          container: impactContainer,
          teardown
        });
        effects.impactContainer = impactContainer;
      }
    }
  }
  actions.next();
};
