import EffectsManager from "./EffectsManager";

const handleEnterContainer = ({ lifeUpDragger }, ctx, actions) => {
  const { impactRawInfo, prevImpact, dndEffects } = ctx;

  const prevImpactVContainer = prevImpact.impactVContainer;
  const currentImpactVContainer = impactRawInfo.impactVContainer;

  if (
    (!prevImpactVContainer && currentImpactVContainer) ||
    (prevImpactVContainer &&
      currentImpactVContainer &&
      prevImpactVContainer.id !== currentImpactVContainer.id)
  ) {
    let effectsManager = containerEffects.find(currentImpactVContainer.id);
    const { impactVContainer } = impactRawInfo;

    if (effectsManager === -1) {
      effectsManager = new EffectsManager({
        dragger: lifeUpDragger,
        impactContainer: impactVContainer
      });

      dndEffects.add(effectsManager);
    }

    ctx.action = {
      operation: "onEnter",
      isHomeContainerFocused: !isHomeContainer(prevImpactVContainer),
      effectsManager
    };
  }

  actions.next();
};

export default handleEnterContainer;
