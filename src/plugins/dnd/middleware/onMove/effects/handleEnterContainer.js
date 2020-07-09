import EffectsManager from "./EffectsManager";
import report from "../../../reporter";

const handleEnterContainer = (
  { lifeUpDragger, isHomeContainer, prevImpact },
  ctx,
  actions
) => {
  const { impactRawInfo, dndEffects } = ctx;

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

    report.logEnterContainer(currentImpactVContainer);

    ctx.action = {
      operation: "onEnter",
      isHomeContainerFocused: isHomeContainer(currentImpactVContainer),
      effectsManager
    };
    ctx.impact = {
      impactVContainer: currentImpactVContainer
    };
  }

  actions.next();
};

export default handleEnterContainer;
