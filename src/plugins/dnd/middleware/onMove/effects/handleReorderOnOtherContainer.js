import { orientationToMeasure } from '../../../utils';

const handleReorderOnHomeContainer = (ctx, actions) => {
  const {
    action: { operation, isHomeContainerFocused, effectsManager },
  } = ctx;

  if (operation !== 'reorder' || isHomeContainerFocused) {
    actions.next();
    return;
  }

  const {
    impactRawInfo: {
      candidateVDragger,
      impactVContainer,
      impactPosition,
      candidateVDraggerIndex,
    },
    impact: { index: currentIndex },
  } = ctx;
  const {
    containerConfig: { orientation, draggerEffect },
  } = impactVContainer;

  const measure = orientationToMeasure(orientation);

  if (typeof draggerEffect !== 'function') {
    actions.next();
    return;
  }

  const impact = {
    impactVContainer,
    index: candidateVDraggerIndex,
  };

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

    if (index !== -1) {
      const { teardown } = effectsManager.downstreamDraggersEffects[index];
      effectsManager.downstreamDraggersEffects.splice(index, 1);
      teardown();
    }
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
      isHighlight: true,
    });

    effectsManager.downstreamDraggersEffects.push({
      vDragger: candidateVDragger,
      teardown,
    });
  }

  ctx.impact = impact;

  actions.next();
};

export default handleReorderOnHomeContainer;
