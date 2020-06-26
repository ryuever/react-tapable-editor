import handleEnterContainer from "./handleEnterContainer";

const handleEnterHomeContainer = ({ liftUpVDraggerIndex }, ctx, actions) => {
  const {
    candidateVDragger,
    impactVContainer,
    impactPosition,
    candidateVDraggerIndex
  } = impactRawInfo;
  const { orientation, impactDraggerEffect, draggerEffect } = impactVContainer;

  const {
    impactRawInfo,
    prevImpact,
    containerEffects,
    dndConfig: { withPlaceholder },
    impact
  } = ctx;

  const effectsManager = containerEffects.find(prevImpactVContainer.id);

  const {
    containerConfig: { containerEffect },
    children
  } = impactVContainer;

  const axis = orientationToAxis[orientation];
  const measure = axisMeasure[axis];
  const positionIndex = measure.indexOf(impactPosition);
  const impact = {};

  if (typeof containerEffect === "function") {
    effectsManager.impactContainerEffects.push({
      teardown: containerEffect({
        el: impactVContainer.el
      })
    });
  }

  if (candidateVDraggerIndex === liftUpVDraggerIndex) {
    if (!positionIndex) effectsManager.upstreamDraggerEffects.teardown();
    else {
      let leftIndex;
      effectsManager.upstreamDraggerEffects.forEach(
        ({ vDragger, teardown }, index) => {
          if (vDragger.id !== candidateVDragger.id) teardown();
          else {
            leftIndex = index;
          }
        }
      );

      if (typeof leftIndex !== "undefined")
        effectsManager.upstreamDraggerEffects =
          effectsManager.upstreamDraggerEffects[leftIndex];
    }
  }

  if (candidateVDraggerIndex < liftUpVDraggerIndex) {
    effectsManager.upstreamDraggerEffects.teardown();
    let initialValue = candidateVDraggerIndex;
    if (positionIndex) {
      initialValue = initialValue + 1;
    }
    for (let i = initialValue; i < liftUpVDraggerIndex; i++) {
      const vDragger = children.getItem(i);
      effectsManager.downstreamDraggersEffects.push({
        teardown: draggerEffect({
          el: vDragger.el,
          needMove: true,
          downstream: true,
          placedPosition: measure[0]
        }),
        vDragger
      });
    }
  }

  if (candidateVDraggerIndex > liftUpVDraggerIndex) {
    const initialValue = liftUpVDraggerIndex + 1;
    let endValue = candidateVDraggerIndex;
    if (position) endValue = endValue + 1;
    const reserved = [];
    const reservedEffects = [];
    for (let i = initialValue; i < endValue; i++) {
      const vDragger = children.getItem(i);
      reserved.push(vDragger);
    }

    effectsManager.upstreamDraggerEffects.forEach(({ teardown, vDragger }) => {
      const id = vDragger.id;
      const index = reserved.findIndex(vDragger => vDragger.id === id);
      if (index !== -1) {
        reservedEffects.push({ teardown, vDragger });
      } else teardown();
    });

    effectsManager.upstreamDraggerEffects = reservedEffects;
  }

  actions.next();
};

export default handleEnterHomeContainer;
