import { Action } from 'sabar';
import { OnMoveHandleContext, OnMoveArgs } from 'types';
import { generateContainerEffectKey } from './utils';

const handleImpactContainerEffect = (
  args: any,
  ctx: object,
  actions: Action
) => {
  const { prevImpact } = args as OnMoveArgs;
  const context = ctx as OnMoveHandleContext;
  const {
    dndEffects,
    impactRawInfo,
    action: { operation, isHomeContainerFocused, effectsManager },
  } = context;

  if (operation === 'onLeave') {
    const { impactVContainer } = prevImpact;
    const effectsManager = dndEffects.find(impactVContainer!.id);
    effectsManager.clearImpactContainerEffects();
  }

  const { impactVContainer } = impactRawInfo;

  if (
    operation === 'onEnter' &&
    !isHomeContainerFocused &&
    effectsManager &&
    impactVContainer
  ) {
    const {
      containerConfig: { impactContainerEffect },
    } = impactVContainer;
    if (typeof impactContainerEffect === 'function') {
      const effectKey = generateContainerEffectKey(impactVContainer!, 'active');
      const index = effectsManager.impactContainerEffects.findIndex(
        ({ key }) => key === effectKey
      );

      if (index === -1) {
        const teardown = impactContainerEffect({
          container: impactVContainer.el,
          isHighlight: true,
        });

        effectsManager.impactContainerEffects.push({
          teardown,
          vContainer: impactVContainer,
          key: effectKey,
        });
      }
    }
  }

  actions.next();
};

export default handleImpactContainerEffect;
