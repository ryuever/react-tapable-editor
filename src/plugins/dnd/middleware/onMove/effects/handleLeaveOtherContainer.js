const handleLeaveOtherContainer = (ctx, actions) => {
  const {
    action: { operation, isHomeContainerFocused, effectsManager }
  } = ctx;
  if (operation !== "onLeave" || isHomeContainerFocused) {
    effectsManager.teardown();
    actions.next();
    return;
  }

  actions.next();
};

export default handleLeaveOtherContainer;
