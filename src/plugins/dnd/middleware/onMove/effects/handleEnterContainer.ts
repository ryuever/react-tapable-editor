import EffectsManager from './EffectsManager';
import report from '../../../reporter';
import Dragger from '../../../Dragger';
import Container from '../../../Container';
import { Impact, OnMoveHandleContext } from '../../../../../types';
import { Action } from 'sabar';

const handleEnterContainer = (
  {
    lifeUpDragger,
    isHomeContainer,
    prevImpact,
  }: {
    lifeUpDragger: Dragger;
    isHomeContainer: (container: Container) => boolean;
    prevImpact: Impact;
  },
  ctx: object,
  actions: Action
) => {
  const context = ctx as OnMoveHandleContext;
  const { impactRawInfo, dndEffects } = context;

  const prevImpactVContainer = prevImpact.impactVContainer;
  const currentImpactVContainer = impactRawInfo.impactVContainer;

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
      operation: 'onEnter',
      isHomeContainerFocused: isHomeContainer(currentImpactVContainer),
      effectsManager,
    };
    context.impact = {
      impactVContainer: currentImpactVContainer,
    };
  }

  actions.next();
};

export default handleEnterContainer;
