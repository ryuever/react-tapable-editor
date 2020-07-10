import report from '../../../reporter';

const handleLeaveContainer = (
  { isHomeContainer, prevImpact },
  ctx,
  actions
) => {
  const { impactRawInfo, dndEffects } = ctx;

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

    ctx.action = {
      operation: 'onLeave',
      isHomeContainerFocused: isHomeContainer(prevImpactVContainer),
      effectsManager,
    };
  }

  actions.next();
};

export default handleLeaveContainer;
