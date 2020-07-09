import { orientationToMeasure } from "../../../utils";
import { generateEffectKey } from "./utils";

const handleImpactDraggerEffect = ({ liftUpVDragger }, ctx, actions) => {
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
        dragger: liftUpVDragger.el,
        container: impactVContainer.el,
        candidateDragger: candidateVDragger.el,
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

    ctx.output = {
      dragger: liftUpVDragger.el,
      candidateDragger: candidateVDragger.el,
      container: impactVContainer.el,
      placedPosition: impactPosition
    };
  }

  actions.next();
};

export default handleImpactDraggerEffect;
