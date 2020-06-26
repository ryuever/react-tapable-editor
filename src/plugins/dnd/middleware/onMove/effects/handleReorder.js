const handleReorder = ({ isHomeContainer }, ctx, actions) => {
  const {
    impactRawInfo: { impactVContainer: currentImpactVContainer },
    prevImpact: { impactVContainer: prevImpactVContainer },
    containerEffects
  } = ctx;

  if (
    prevImpactVContainer &&
    currentImpactVContainer &&
    prevImpactVContainer.id === currentImpactVContainer.id
  ) {
    let effectsManager = containerEffects.find(currentImpactVContainer.id);

    ctx.action = {
      operation: "reorder",
      isHomeContainerFocused: !isHomeContainer(currentImpactVContainer),
      effectsManager
    };

    actions.next();
    return;
  }

  actions.next();
};

export default handleReorder;
