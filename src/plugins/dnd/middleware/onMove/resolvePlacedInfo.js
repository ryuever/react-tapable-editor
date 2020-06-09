const operation = {
  REPLACE: "replace",
  REMOVE: "remove",
  REORDER: "reorder"
};

export default ({ dragger }, ctx, actions) => {
  const { isMovingOnHomeContainer, placedAtRaw, targetContainer } = ctx;

  if (!placedAtRaw) {
    actions.next();
    return;
  }

  const { index: rawIndex } = placedAtRaw;
  const placedAt = {
    index: undefined
  };

  if (!isMovingOnHomeContainer) {
    placedAt.index = rawIndex;
    placedAt.operation = operation["REPLACE"];
    ctx.placedAt = placedAt;
    actions.next();
    return;
  }

  // when `isMovingOnHomeContainer` is true, the relative position of dragger and dropped place
  // will matter on final `placedAt.index`
  const { children } = targetContainer;
  const draggerItemIndex = children.findIndex(dragger);
  const moveAfter = draggerItemIndex < rawIndex;

  placedAt.operation = operation["REORDER"];
  placedAt.index = moveAfter ? rawIndex - 1 : rawIndex;
  ctx.placedAt = placedAt;
  actions.next();
};
