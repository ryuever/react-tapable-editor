import { orientationToMeasure } from "../../../utils";

const handleImpactDraggerEffectOnReorder = (ctx, actions) => {
  const {
    impactRawInfo,
    prevImpact,
    action: { operation, effectsManager }
  } = ctx;

  if (operation !== "reorder") {
    actions.next();
    return;
  }

  const { index: currentIndex } = prevImpact;

  const {
    impactVContainer: {
      el,
      containerConfig: { orientation, impactDraggerEffect }
    },
    impactPosition,
    candidateVDragger,
    candidateVDraggerIndex
  } = impactRawInfo;
  const measure = orientationToMeasure(orientation);

  if (typeof impactDraggerEffect === "function") {
    if (
      currentIndex < candidateVDraggerIndex &&
      impactPosition === measure[1]
    ) {
      effectsManager.clearImpactDraggerEffects();
      const teardown = impactDraggerEffect({
        el: candidateVDragger.el,
        shouldMove: true,
        placedPosition: measure[1],
        downstream: false,
        dimension: candidateVDragger.dimension.rect,
        isHighlight: true
      });
      effectsManager.impactDraggerEffects.push({
        teardown,
        vDragger: candidateVDragger
      });

      if (
        currentIndex > candidateVDraggerIndex &&
        impactPosition === measure[0]
      ) {
        effectsManager.clearImpactDraggerEffects();
        const teardown = impactDraggerEffect({
          el: candidateVDragger.el,
          shouldMove: true,
          placedPosition: measure[0],
          downstream: true,
          dimension: candidateVDragger.dimension.rect,
          isHighlight: true
        });
        effectsManager.impactDraggerEffects.push({
          teardown,
          vDragger: candidateVDragger
        });
      }
    }
  }

  actions.next();
};

export default handleImpactDraggerEffectOnReorder;
