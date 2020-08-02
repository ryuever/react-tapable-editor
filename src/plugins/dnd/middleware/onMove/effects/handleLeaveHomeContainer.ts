import { orientationToMeasure } from '../../../utils';
import { OnMoveArgs, OnMoveHandleContext } from '../../../../../types';
import { Action } from 'sabar';

const handleLeaveHomeContainer = (args: any, ctx: object, actions: Action) => {
  const { prevImpact, liftUpVDraggerIndex } = args as OnMoveArgs;
  const context = ctx as OnMoveHandleContext;
  const {
    dndConfig: { withPlaceholder },
    action: { operation, isHomeContainerFocused, effectsManager },
  } = context;

  if (operation !== 'onLeave' || !isHomeContainerFocused) {
    actions.next();
    return;
  }

  if (!withPlaceholder) {
    effectsManager!.teardown();
    actions.next();
    return;
  }

  const { index, impactVContainer } = prevImpact;

  if (!index || !impactVContainer) {
    actions.next();
  }

  const {
    children,
    containerConfig: { orientation, draggerEffect },
  } = impactVContainer!;
  // Don't care prev index, reset all the effects on the items before
  // `liftUpVDraggerIndex`
  effectsManager!.clearDownstreamEffects();
  if (typeof draggerEffect === 'function') {
    const upstreamStartIndex = Math.max(liftUpVDraggerIndex + 1, index!);
    const len = children.getSize();

    for (let i = upstreamStartIndex; i < len; i++) {
      const vDragger = children.getItem(i);
      const measure = orientationToMeasure(orientation);
      const teardown = draggerEffect({
        el: vDragger.el,
        shouldMove: true,
        placedPosition: measure[0],
        downstream: false,
        dimension: vDragger.dimension.rect,
        isHighlight: false,
      });

      effectsManager!.upstreamDraggersEffects.push({
        teardown,
        vDragger,
      });
    }
  }

  actions.next();
};

export default handleLeaveHomeContainer;
