import { orientationToMeasure } from "./../../../utils";

const handleLeaveHomeContainer = (ctx, actions) => {
  const {
    prevImpact,
    dndConfig: { withPlaceholder },
    action: { operation, isHomeContainerFocused, effectsManager }
  } = ctx;

  if (operation !== "onLeave" || !isHomeContainerFocused) {
    actions.next();
    return;
  }

  if (!withPlaceholder) {
    effectsManager.teardown();
    actions.next();
    return;
  }

  const {
    index,
    impactContainer: {
      children,
      draggerEffect,
      containerConfig: { orientation }
    }
  } = prevImpact;

  // Don't care prev index, reset all the effects on the items before
  // `liftUpVDraggerIndex`
  effectsManager.clearDownstreamEffects();
  effectsManager.clearImpactContainerEffects();

  const upstreamStartIndex = Math.max(liftUpVDraggerIndex + 1, index);
  const len = children.getSize();

  for (let i = upstreamStartIndex; i < len; i++) {
    const vDragger = children.getItem(i);
    const measure = orientationToMeasure(orientation);
    const teardown = draggerEffect({
      el: vDragger.el,
      shouldMove: true,
      placedPosition: measure[0],
      downstream: false,
      dimension: vDragger.dimension.rect,
      isHighlight: false
    });

    effectsManager.upstreamDraggerEffects.push({
      teardown,
      vDragger
    });
  }

  actions.next();
};

export default handleLeaveHomeContainer;
