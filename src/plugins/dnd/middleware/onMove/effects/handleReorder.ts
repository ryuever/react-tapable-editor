import Container from '../../../Container';
import { Impact, OnMoveHandleContext } from '../../../../../types';
import { Action } from 'sabar';

const handleReorder = (
  {
    prevImpact,
    isHomeContainer,
  }: {
    isHomeContainer: (container: Container) => boolean;
    prevImpact: Impact;
  },
  ctx: object,
  actions: Action
) => {
  const context = ctx as OnMoveHandleContext;
  const {
    impactRawInfo: { impactVContainer: currentImpactVContainer },
    dndEffects,
  } = context;
  const { impactVContainer: prevImpactVContainer } = prevImpact;

  if (
    prevImpactVContainer &&
    currentImpactVContainer &&
    prevImpactVContainer.id === currentImpactVContainer.id
  ) {
    const effectsManager = dndEffects.find(currentImpactVContainer.id);

    context.action = {
      operation: 'reorder',
      isHomeContainerFocused: isHomeContainer(currentImpactVContainer),
      effectsManager,
    };

    actions.next();
    return;
  }

  actions.next();
};

export default handleReorder;
