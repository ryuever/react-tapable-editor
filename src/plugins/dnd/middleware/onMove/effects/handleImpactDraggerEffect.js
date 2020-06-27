import { orientationToMeasure } from "../../../utils";
import { generateEffectKey } from "./utils";

const handleImpactDraggerEffect = (ctx, actions) => {
  const {
    impactRawInfo,
    dndEffects,
    dndConfig: { withPlaceholder }
  } = ctx;

  const { impactVContainer, impactPosition, candidateVDragger } = impactRawInfo;

  if (withPlaceholder || !impactVContainer) {
    actions.next();
    return;
  }

  const {
    el,
    containerConfig: { orientation, impactDraggerEffect }
  } = impactVContainer;

  const effectsManager = dndEffects.find(impactVContainer.id);

  const measure = orientationToMeasure(orientation);
  const positionIndex = measure.indexOf(impactPosition);

  if (typeof impactDraggerEffect === "function") {
    const effectKey = generateEffectKey(
      impactVContainer,
      candidateVDragger,
      impactPosition
    );
    const index = effectsManager.impactDraggerEffects.findIndex(
      ({ key }) => key === effectKey
    );

    if (index === -1) {
      effectsManager.clearImpactDraggerEffects();
      const teardown = impactDraggerEffect({
        el,
        shouldMove: !positionIndex,
        downstream: !positionIndex,
        placedPosition: impactPosition,
        dimension: candidateVDragger.dimension.rect,
        isHighlight: true
      });

      effectsManager.impactDraggerEffects.push({
        teardown,
        vDragger: candidateVDragger,
        key: effectKey
      });
    }
  }

  actions.next();
};

export default handleImpactDraggerEffect;
