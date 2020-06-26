import { orientationToMeasure } from "../../../utils";

const handleImpactDraggerEffectOnEnter = (ctx, actions) => {
  const {
    impactRawInfo,
    effectsManager,
    action: { operation }
  } = ctx;

  if (operation !== "onEnter") {
    actions.next();
    return;
  }
  const {
    impactVContainer: {
      el,
      containerConfig: { orientation, impactDraggerEffect }
    },
    impactPosition,
    candidateVDragger
  } = impactRawInfo;
  const { impactPosition } = impactRawInfo;

  const measure = orientationToMeasure(orientation);
  const positionIndex = measure.indexOf(impactPosition);

  if (typeof impactDraggerEffect === "function") {
    const teardown = impactDraggerEffect({
      el,
      shouldMove: !positionIndex,
      downstream: !positionIndex,
      placedPosition: measure[0]
    });

    effectsManager.impactDraggerEffects.push({
      teardown,
      vDragger: candidateVDragger
    });
  }

  actions.next();
};

export default handleImpactDraggerEffectOnEnter;
