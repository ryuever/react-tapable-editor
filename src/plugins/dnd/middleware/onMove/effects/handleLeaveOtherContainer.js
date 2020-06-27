const handleLeaveOtherContainer = (ctx, actions) => {
  const {
    action: { operation, isHomeContainerFocused, effectsManager }
  } = ctx;
  if (operation !== "onLeave" || isHomeContainerFocused) {
    actions.next();
    return;
  }

  effectsManager.teardown();

  actions.next();
};

export default handleLeaveOtherContainer;
