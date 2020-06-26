const handleEnterOtherContainer = (ctx, actions) => {
  const {
    impactRawInfo,
    effectsManager,
    action: { operation, isHomeContainerFocused }
  } = ctx;

  if (operation !== "onEnter" || isHomeContainerFocused) {
    actions.next();
    return;
  }

  const {
    impactVContainer,
    impactPosition,
    candidateVDraggerIndex
  } = impactRawInfo;

  const {
    containerConfig: { containerEffect, draggerEffect, orientation },
    children
  } = impactVContainer;

  const measure = orientationToMeasure(orientation);
  const positionIndex = measure.indexOf(impactPosition);

  if (typeof containerEffect === "function") {
    const teardown = containerEffect({
      el: impactVContainer.el
    });
    effectsManager.impactContainerEffects.push({
      teardown,
      vContainer: impactVContainer
    });
  }

  if (typeof draggerEffect !== "function") {
    actions.next();
    return;
  }

  let initialValue = candidateVDraggerIndex;

  if (positionIndex === 1) {
    initialValue = initialValue + 1;
  }

  const impact = {
    index: initialValue,
    impactVContainer
  };

  const len = children.getSize();

  for (let i = initialValue; i < len; i++) {
    const vDragger = children.getItem(i);
    const teardown = draggerEffect({
      placedPosition: measure[0],
      shouldMove: true,
      el: vDragger.el,
      downstream: true
    });
    effectsManager.impactDownstreamEffects.push({ teardown, vDragger });
  }

  ctx.impact = impact;

  actions.next();
};

export default handleEnterOtherContainer;
