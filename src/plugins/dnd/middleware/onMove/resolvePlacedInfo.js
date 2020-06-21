const operation = {
  REPLACE: "replace",
  REMOVE: "remove",
  REORDER: "reorder"
};

const returnRoot = info => {
  const { childInfo } = info;

  if (childInfo) return returnRoot(childInfo);
  else return info;
};

export default ({ dragger }, ctx, actions) => {
  const { isMovingOnHomeContainer, placedAtRaw, targetContainer } = ctx;

  if (!targetContainer) {
    actions.abort();
    return;
  }

  if (!placedAtRaw) {
    actions.next();
    return;
  }

  const root = returnRoot(placedAtRaw);

  const { index: rawIndex, dragger: candidatePositionDragger } = root;
  const placedAt = {
    index: undefined,
    candidatePositionDragger
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

  // move to self, then do nothing
  if (draggerItemIndex === rawIndex) {
    actions.abort();
    return;
  }

  const moveAfter = draggerItemIndex < rawIndex;

  placedAt.operation = operation["REORDER"];
  placedAt.index = moveAfter ? rawIndex - 1 : rawIndex;
  ctx.placedAt = placedAt;

  actions.next();
};
