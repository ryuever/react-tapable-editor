import EffectsManager from './EffectsManager';
import report from '../../../reporter';
import Container from '../../../Container';
import {
  OnMoveHandleContext,
  OnMoveArgs,
  OnMoveOperation,
} from '../../../../../types';
import { Action } from 'sabar';

const handleEnterContainer = (args: any, ctx: object, actions: Action) => {
  const { lifeUpDragger, isHomeContainer, prevImpact } = args as OnMoveArgs;
  const context = ctx as OnMoveHandleContext;
  const { impactRawInfo, dndEffects } = context;

  const prevImpactVContainer = prevImpact.impactVContainer;
  const currentImpactVContainer = impactRawInfo.impactVContainer;

  console.log('prev ', prevImpactVContainer, currentImpactVContainer);

  if (
    (!prevImpactVContainer && currentImpactVContainer) ||
    (prevImpactVContainer &&
      currentImpactVContainer &&
      prevImpactVContainer.id !== currentImpactVContainer.id)
  ) {
    let effectsManager = dndEffects.find(currentImpactVContainer.id);
    const { impactVContainer } = impactRawInfo;

    if (!effectsManager) {
      effectsManager = new EffectsManager({
        dragger: lifeUpDragger,
        impactContainer: impactVContainer as Container,
      });

      dndEffects.add(effectsManager);
    }

    report.logEnterContainer(currentImpactVContainer);

    context.action = {
      operation: OnMoveOperation.OnEnter,
      isHomeContainerFocused: isHomeContainer(currentImpactVContainer),
      effectsManager,
    };
    context.impact = {
      impactVContainer: currentImpactVContainer,
      index: null,
    };
  }

  actions.next();
};

export default handleEnterContainer;
