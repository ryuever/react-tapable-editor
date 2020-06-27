const handleLeaveContainer = ({ isHomeContainer }, ctx, actions) => {
  const { impactRawInfo, prevImpact, containerEffects } = ctx;

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
    const effectsManager = containerEffects.find(prevImpactVContainer.id);

    ctx.action = {
      operation: "onLeave",
      isHomeContainerFocused: !isHomeContainer(prevImpactVContainer),
      effectsManager: effectsManager
    };
  }

  actions.next();
};

export default handleLeaveContainer;
