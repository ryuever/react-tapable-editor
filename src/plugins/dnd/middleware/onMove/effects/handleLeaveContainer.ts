import report from '../../../reporter';
import Container from '../../../Container';
import { Impact, OnMoveHandleContext } from '../../../../../types';
import { Action } from 'sabar';

const handleLeaveContainer = (
  {
    isHomeContainer,
    prevImpact,
  }: {
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

  if (!prevImpactVContainer && currentImpactVContainer) {
    actions.next();
    return;
  }

  if (
    (prevImpactVContainer && !currentImpactVContainer) ||
    (prevImpactVContainer &&
      currentImpactVContainer &&
      prevImpactVContainer.id !== currentImpactVContainer.id)
  ) {
    const effectsManager = dndEffects.find(prevImpactVContainer.id);
    report.logLeaveContainer(prevImpactVContainer);

    context.action = {
      operation: 'onLeave',
      isHomeContainerFocused: isHomeContainer(prevImpactVContainer),
      effectsManager,
    };
  }

  actions.next();
};

export default handleLeaveContainer;
