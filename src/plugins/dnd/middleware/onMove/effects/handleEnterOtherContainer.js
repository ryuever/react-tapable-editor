import { orientationToMeasure } from "../../../utils";

const handleEnterOtherContainer = (ctx, actions) => {
  const {
    impactRawInfo,
    action: { operation, isHomeContainerFocused, effectsManager }
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
    const isHighlight = i === initialValue;
    const teardown = draggerEffect({
      placedPosition: isHighlight ? impactPosition : measure[0],
      shouldMove: !isHighlight || !positionIndex,
      downstream: !isHighlight || !positionIndex,
      el: vDragger.el,
      dimension: vDragger.dimension.rect,
      isHighlight
    });
    effectsManager.downstreamDraggersEffects.push({ teardown, vDragger });
  }

  ctx.impact = impact;

  actions.next();
};

export default handleEnterOtherContainer;
