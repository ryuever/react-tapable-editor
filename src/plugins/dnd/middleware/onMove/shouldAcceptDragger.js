// To determine dragger should be accepted by container

export default ({ dragger }, ctx, actions) => {
  // first class should be matched
  const { overlappedContainer } = ctx;
  if (!overlappedContainer) {
    ctx.isOverlapping = false;
    actions.next();
  }

  const dndConfig = overlappedContainer.dndConfig;
  const { draggerSelector, shouldAcceptDragger } = dndConfig;

  if (dragger.el.matches(draggerSelector)) {
    if (typeof shouldAcceptDragger === "function") {
      ctx.isOverlapping = shouldAcceptDragger();
    } else {
      ctx.isOverlapping = true;
    }
  } else {
    ctx.isOverlapping = false;
  }

  actions.next();
};
