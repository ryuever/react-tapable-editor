const handleLeaveOtherContainer = (ctx, actions) => {
  const { action } = ctx;

  const { operation, isHomeContainerFocused, effectsManager } = action;

  if (operation !== "onLeave" || isHomeContainerFocused) {
    effectsManager.teardown();
    actions.next();
    return;
  }

  actions.next();
};

export default handleLeaveOtherContainer;
