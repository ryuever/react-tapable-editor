import { orientationToMeasure } from "../../../utils";

const handleEnterHomeContainer = ({ liftUpVDraggerIndex }, ctx, actions) => {
  const {
    impactRawInfo,
    action: { operation, isHomeContainerFocused, effectsManager }
  } = ctx;

  if (operation !== "onEnter" || !isHomeContainerFocused) {
    actions.next();
    return;
  }

  const {
    candidateVDragger,
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

  const impact = {
    impactVContainer,
    index: positionIndex ? candidateVDraggerIndex + 1 : candidateVDraggerIndex
  };

  if (candidateVDraggerIndex === liftUpVDraggerIndex) {
    if (!positionIndex) effectsManager.clearUpstreamEffects();
    else {
      const remainingEffects = [];
      effectsManager.upstreamDraggersEffects.forEach(
        ({ vDragger, teardown }) => {
          if (vDragger.id !== candidateVDragger.id) teardown();
          else remainingEffects.push({ vDragger, teardown });
        }
      );

      effectsManager.upstreamDraggersEffects = remainingEffects;
    }
  }

  if (candidateVDraggerIndex < liftUpVDraggerIndex) {
    effectsManager.clearUpstreamEffects();
    const initialValue = candidateVDraggerIndex;
    for (let i = initialValue; i < liftUpVDraggerIndex; i++) {
      const vDragger = children.getItem(i);
      const isHighlight = initialValue === i;

      const teardown = draggerEffect({
        el: vDragger.el,
        shouldMove: !isHighlight || !positionIndex,
        downstream: !isHighlight || !positionIndex,
        placedPosition: isHighlight ? impactPosition : measure[0],
        dimension: vDragger.dimension.rect,
        isHighlight
      });
      effectsManager.downstreamDraggersEffects.push({ teardown, vDragger });
    }
  }

  if (candidateVDraggerIndex > liftUpVDraggerIndex) {
    const initialValue = liftUpVDraggerIndex + 1;
    let endValue = candidateVDraggerIndex;
    if (positionIndex) endValue = endValue + 1;
    const reserved = [];
    const reservedEffects = [];
    for (let i = initialValue; i < endValue; i++) {
      const vDragger = children.getItem(i);
      reserved.push(vDragger);
    }

    effectsManager.upstreamDraggersEffects.forEach(({ teardown, vDragger }) => {
      const id = vDragger.id;
      const index = reserved.findIndex(vDragger => vDragger.id === id);
      if (index !== -1) {
        reservedEffects.push({ teardown, vDragger });
      } else teardown();
    });

    effectsManager.upstreamDraggersEffects = reservedEffects;
  }

  ctx.impact = impact;

  actions.next();
};

export default handleEnterHomeContainer;
