import report from '../../../reporter';
import {
  OnMoveHandleContext,
  OnMoveArgs,
  OnMoveOperation,
} from '../../../../../types';
import { Action } from 'sabar';

const handleLeaveContainer = (args: any, ctx: object, actions: Action) => {
  const { isHomeContainer, prevImpact } = args as OnMoveArgs;
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
      operation: OnMoveOperation.OnLeave,
      isHomeContainerFocused: isHomeContainer(prevImpactVContainer),
      effectsManager,
    };
  }

  actions.next();
};

export default handleLeaveContainer;
