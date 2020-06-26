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

  if (isOnHomeContainer) {
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

  // move down
  if (currentIndex < candidateVDraggerIndex) {
    if (impactPosition === measure[0]) {
      actions.next();
      return;
    }

    const index = effectsManager.downstreamEffects.findIndex(({ vDragger }) => {
      return vDragger.id === candidateVDragger.id;
    });
    const { teardown } = effectsManager.downstreamEffects.splice(index, 1);
    teardown();
  }

  // move up
  if (currentIndex > candidateVDraggerIndex) {
    if (impactPosition === measure[1]) {
      actions.next();
      return;
    }

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

  actions.next();
};

export default handleReorderOnHomeContainer;
