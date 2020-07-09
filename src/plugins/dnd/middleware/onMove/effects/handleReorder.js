const handleReorder = ({ prevImpact, isHomeContainer }, ctx, actions) => {
  const {
    impactRawInfo: { impactVContainer: currentImpactVContainer },
    dndEffects
  } = ctx;
  const { impactVContainer: prevImpactVContainer } = prevImpact;

  if (
    prevImpactVContainer &&
    currentImpactVContainer &&
    prevImpactVContainer.id === currentImpactVContainer.id
  ) {
    let effectsManager = dndEffects.find(currentImpactVContainer.id);

    ctx.action = {
      operation: "reorder",
      isHomeContainerFocused: isHomeContainer(currentImpactVContainer),
      effectsManager
    };

    actions.next();
    return;
  }

  actions.next();
};

export default handleReorder;
