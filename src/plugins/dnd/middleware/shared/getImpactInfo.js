import { orientationToAxis, axisMeasure } from "../../utils";

const getImpactInfo = (
  { liftUpVDraggerIndex, isHomeContainer },
  ctx,
  actions
) => {
  const {
    impactRawInfo,
    prevImpact,
    containerEffects,
    dndConfig: { withPlaceholder }
  } = ctx;

  const prevImpactVContainer = prevImpact.impactVContainer;
  const currentImpactVContainer = impactRawInfo.impactVContainer;

  if (!prevImpactVContainer && currentImpactVContainer) {
    actions.next();
    return;
  }

  if (
    (prevImpactVContainer && !currentImpactVContainer) ||
    (prevImpactVContainer &&
      currentImpactVContainer &&
      prevImpactVContainer.id !== currentImpactVContainer.id)
  ) {
    const prevImpactVContainerEffects = containerEffects.find(
      prevImpactVContainer.id
    );
    if (!isHomeContainer(prevImpactVContainer)) {
      prevImpactVContainerEffects.teardown();
      actions.next();
      return;
    }

    if (!withPlaceholder) {
      prevImpactVContainerEffects.teardown();
      actions.next();
      return;
    }

    const { index, impactContainer } = prevImpact;
    prevImpactVContainerEffects.clearDownstream();
    prevImpactVContainerEffects.clearContainer();
    const upstreamStartIndex = Math.max(liftUpVDraggerIndex, index);
    const children = impactContainer.children;
    const len = children.getSize();
    const { draggerEffect } = impactContainer;
    for (let i = upstreamStartIndex; i < len; i++) {
      const vDragger = children.getItem(i);
      const axis = orientationToAxis[impactContainer.orientation];
      const measure = axisMeasure[axis];
      draggerEffect({
        el: vDragger.el,
        needMove: true,
        placedPosition: measure[0]
      });
    }
  }
};

export default getImpactInfo;
