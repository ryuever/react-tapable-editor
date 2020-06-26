import { orientationToMeasure } from "../../../utils";

const handleReorderOnHomeContainer = (
  { liftUpVDraggerIndex },
  ctx,
  actions
) => {
  const {
    actions: { operation, isHomeContainerFocused, effectsManager }
  } = ctx;

  if (operation !== "reorder" || !isHomeContainerFocused) {
    actions.next();
    return;
  }

  const {
    impactRawInfo: {
      candidateVDragger,
      impactVContainer: {
        containerConfig: { orientation, draggerEffect }
      },
      impactPosition,
      candidateVDraggerIndex
    },
    impact: { index: currentIndex }
  } = ctx;

  const measure = orientationToMeasure(orientation);

  if (typeof draggerEffect !== "function") {
    actions.next();
    return;
  }

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
          shouldMove: true,
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
          shouldMove: true,
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
