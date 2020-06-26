const handleReorder = (
  { liftUpVDraggerIndex, isHomeContainer },
  ctx,
  actions
) => {
  const {
    impactRawInfo,
    prevImpact,
    containerEffects,
    dndConfig: { withPlaceholder }
  } = ctx;

  const prevImpactVContainer = prevImpact.impactVContainer;
  const currentImpactVContainer = impactRawInfo.impactVContainer;

  if (
    prevImpactVContainer &&
    currentImpactVContainer &&
    prevImpactVContainer.id === currentImpactVContainer.id
  ) {
    ctx.action = {};
    ctx.action.operation = "reorder";
    ctx.actions.isOnHomeContainer = isHomeContainer(
      impactRawInfo.impactVContainer
    );

    actions.next();
    return;
  }

  actions.next();
};

export default handleReorder;
