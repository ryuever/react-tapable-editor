const operation = {
  REPLACE: 'replace',
  REMOVE: 'remove',
  REORDER: 'reorder',
};

const returnRoot = info => {
  const { childInfo } = info;

  if (childInfo) return returnRoot(childInfo);
  return info;
};

export default ({ dragger }, ctx, actions) => {
  const {
    isMovingOnHomeContainer,
    placedAtRaw,
    targetContainer,
    impactPosition,
  } = ctx;

  if (!targetContainer) {
    actions.abort();
    return;
  }

  if (!placedAtRaw) {
    actions.next();
    return;
  }

  const upstreamPosition = ['top', 'left'];
  const downstreamPosition = ['right', 'bottom'];

  const root = returnRoot(placedAtRaw);
  const { index: rawIndex, targetDragger, tailing } = root;
  const placedAt = {
    index: undefined,
    targetDragger,
    tailing,
  };

  const impact = {
    downstreamDraggers: [],
    upstreamDraggers: [],

    impactPosition: null,
    impactDragger: targetDragger,
    impactContainer: targetDragger.container,
  };

  const { children } = targetContainer;

  if (!isMovingOnHomeContainer) {
    impact.index = rawIndex;
    impact.operation = operation.REPLACE;
    impact.placedAt = placedAt;
    impact.downstreamDraggers = children.slice(rawIndex + 1);
    if (downstreamPosition.indexOf(impactPosition) !== -1) {
      impact.downstreamDraggers.push(children.getItem(rawIndex));
    }
    ctx.impact = impact;

    actions.next();
    return;
  }

  // when `isMovingOnHomeContainer` is true, the relative position of dragger and dropped place
  // will matter on final `placedAt.index`
  const draggerItemIndex = children.findIndex(dragger);

  // array.slice(a, b): a inclusive, b exclusive
  // target dragger is not processed
  if (draggerItemIndex > rawIndex) {
    impact.downstreamDraggers = children.slice(rawIndex + 1, draggerItemIndex);
    impact.upstreamDraggers = [];
  } else if (draggerItemIndex < rawIndex) {
    impact.downstreamDraggers = [];
    impact.upstreamDraggers = children.slice(draggerItemIndex, rawIndex);

    if (downstreamPosition.indexOf(impactPosition) !== -1) {
      impact.upstreamDraggers.push(children.getItem(rawIndex));
    }
  } else {
    impact.upstreamDraggers = [];
    impact.downstreamDraggers = [];
  }
  impact.operation = operation.REORDER;
  impact.index = rawIndex;

  ctx.impact = impact;

  actions.next();
};
