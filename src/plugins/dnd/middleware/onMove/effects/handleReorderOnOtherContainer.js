import { orientationToMeasure } from "../../../utils";

const handleReorderOnHomeContainer = (ctx, actions) => {
  const {
    action: { operation, isHomeContainerFocused, effectsManager }
  } = ctx;

  if (operation !== "reorder" || isHomeContainerFocused) {
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

  // move down
  if (currentIndex < candidateVDraggerIndex) {
    if (impactPosition === measure[0]) {
      actions.next();
      return;
    }

    const index = effectsManager.downstreamDraggersEffects.findIndex(
      ({ vDragger }) => {
        return vDragger.id === candidateVDragger.id;
      }
    );
    const { teardown } = effectsManager.downstreamDraggersEffects.splice(
      index,
      1
    );
    teardown();
  }

  // move up
  if (currentIndex > candidateVDraggerIndex) {
    if (impactPosition === measure[1]) {
      actions.next();
      return;
    }

    const teardown = draggerEffect({
      el: candidateVDragger.el,
      shouldMove: true,
      placedPosition: measure[0],
      downstream: true,
      dimension: candidateVDragger.dimension.rect,
      isHighlight: true
    });

    effectsManager.downstreamDraggersEffects.push({
      vDragger: candidateVDragger,
      teardown
    });
  }

  actions.next();
};

export default handleReorderOnHomeContainer;
