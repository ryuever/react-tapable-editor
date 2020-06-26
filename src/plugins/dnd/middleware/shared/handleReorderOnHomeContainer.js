import { axisMeasure, orientationToAxis, axisClientMeasure } from "../../utils";

const handleReorderOnHomeContainer = (
  { liftUpVDraggerIndex, isHomeContainer },
  ctx,
  actions
) => {
  const {
    actions: { operation, isOnHomeContainer }
  } = ctx;

  if (operation !== "reorder") {
    actions.next();
    return;
  }

  if (!isOnHomeContainer) {
    actions.next();
    return;
  }

  const {
    impactRawInfo,
    prevImpact,
    containerEffects,
    dndConfig: { withPlaceholder },
    impact
  } = ctx;

  const {
    candidateVDragger,
    impactVContainer,
    impactPosition,
    candidateVDraggerIndex
  } = impactRawInfo;

  const { index: currentIndex } = impact;
  const {
    containerConfig: { orientation }
  } = impactVContainer;
  const axis = orientationToAxis[orientation];
  const measure = axisMeasure[axis];

  const effectsManager = containerEffects.find(prevImpactVContainer.id);

  if (currentIndex < candidateVDraggerIndex) {
    if (impactPosition === measure[0]) {
      actions.next();
      return;
    }

    if (candidateVDraggerIndex <= liftUpVDraggerIndex) {
      const index = effectsManager.downstreamEffects.findIndex(
        ({ vDragger }) => {
          return vDragger.id === candidateVDragger.id;
        }
      );
      const { teardown } = effectsManager.downstreamEffects.splice(index, 1);
      teardown();
    }

    if (candidateVDraggerIndex > liftUpVDraggerIndex) {
      effectsManager.upstreamEffects.push({
        vDragger: candidateVDragger,
        teardown: draggerEffect({
          el: vDragger.el,
          needMove: true,
          placedPosition: measure[1],
          downstream: false
        })
      });
    }
  }

  // move up
  if (currentIndex > candidateVDraggerIndex) {
    if (impactPosition === measure[1]) {
      actions.next();
      return;
    }

    if (candidateVDraggerIndex < liftUpVDraggerIndex) {
      effectsManager.downstreamEffects.push({
        vDragger: candidateVDragger,
        teardown: draggerEffect({
          el: vDragger.el,
          needMove: true,
          placedPosition: measure[0],
          downstream: true
        })
      });
    }

    if (candidateVDraggerIndex >= liftUpVDraggerIndex) {
      const index = effectsManager.upstreamEffects.findIndex(({ vDragger }) => {
        return vDragger.id === candidateVDragger.id;
      });
      const { teardown } = effectsManager.upstreamEffects.splice(index, 1);
      teardown();
    }
  }
  actions.next();
};

export default handleReorderOnHomeContainer;
