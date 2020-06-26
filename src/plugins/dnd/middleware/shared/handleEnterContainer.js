import { orientationToAxis, axisMeasure } from "../../utils";
import Sabar from "sabar";

const handleEnterContainer = (
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

  if (
    prevImpactVContainer &&
    currentImpactVContainer &&
    prevImpactVContainer.id === currentImpactVContainer.id
  ) {
    actions.next();
    return;
  }

  if (!currentImpactVContainer) {
    actions.next();
    return;
  }

  const {
    candidateVDragger,
    impactVContainer,
    impactPosition,
    candidateVDraggerIndex
  } = impactRawInfo;
  const { orientation, impactDraggerEffect, draggerEffect } = impactVContainer;

  const effectsManager = containerEffects.find(prevImpactVContainer.id);

  const {
    containerConfig: { containerEffect },
    children
  } = impactVContainer;

  if (typeof containerEffect === "function") {
    effectsManager.impactContainerEffects.push({
      teardown: containerEffect({
        el: impactVContainer.el
      })
    });
  }

  const axis = orientationToAxis[orientation];
  const measure = axisMeasure[axis];
  const positionIndex = measure.indexOf(impactPosition);
  const impact = {};

  if (!positionIndex) {
    impact.index = candidateVDraggerIndex;

    if (typeof impactDraggerEffect === "function") {
      effectsManager.impactDraggerEffects.push({
        teardown: impactDraggerEffect({
          placedPosition: impactPosition,
          needMove: true,
          el: candidateVDragger.el,
          downstream: true
        })
      });
    }

    if (typeof draggerEffect === "function") {
      effectsManager.impactDraggerEffects.push({
        teardown: draggerEffect({
          placedPosition: impactPosition,
          needMove: true,
          el: candidateVDragger.el,
          downstream: true
        })
      });
    }
  }

  if (positionIndex === 1) {
    impact.index = candidateVDraggerIndex + 1;

    if (typeof impactDraggerEffect === "function") {
      effectsManager.impactDraggerEffects.push({
        teardown: impactDraggerEffect({
          placedPosition: impactPosition,
          needMove: false,
          el: candidateVDragger.el
        })
      });
    }

    if (typeof draggerEffect === "function") {
      effectsManager.impactDraggerEffects.push({
        teardown: draggerEffect({
          placedPosition: impactPosition,
          needMove: false,
          el: candidateVDragger.el
        })
      });
    }
  }

  const len = children.getSize();

  if (typeof draggerEffect === "function") {
    for (let i = candidateVDraggerIndex + 1; i < len; i++) {
      const vDragger = children.getItem(i);
      effectsManager.impactDownstreamEffects.push({
        teardown: draggerEffect({
          placedPosition: measure[0],
          needMove: true,
          el: vDragger.el,
          downstream: true
        })
      });
    }
  }

  ctx.impact = impact;

  actions.next();
};

export default handleEnterContainer;
