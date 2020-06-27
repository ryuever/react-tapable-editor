import EffectsManager from "./EffectsManager";

const handleEnterContainer = (
  { lifeUpDragger, isHomeContainer },
  ctx,
  actions
) => {
  const { impactRawInfo, prevImpact, dndEffects } = ctx;

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
        impactContainer: impactVContainer
      });

      dndEffects.add(effectsManager);
    }

    ctx.action = {
      operation: "onEnter",
      isHomeContainerFocused: prevImpactVContainer
        ? !isHomeContainer(prevImpactVContainer)
        : false,
      effectsManager
    };
  }

  actions.next();
};

export default handleEnterContainer;
