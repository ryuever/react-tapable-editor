/**
 * Effects is used to update the style of element. However, when its the time to
 * remove effects should be reconsidered.
 */
import reporter from "../../reporter";

const isFunction = fn => typeof fn === "function";

const DEBUG = true;

const diff = (a, b) => {
  const copyA = a.slice();
  const copyB = b.slice();
  const lenA = copyA.length;
  const actions = [];
  const remaining = [];

  for (let i = 0; i < lenA; i++) {
    const item = copyA[i];
    const index = copyB.findIndex(({ id }) => item.id === id);
    if (index === -1) {
      actions.push({
        operation: "remove",
        item
      });
    } else {
      remaining.push(item);
      // If item is found in B, then it should not process on B's loop
      copyB.splice(index, 1);
    }
  }

  const lenB = copyB.length;

  for (let j = 0; j < lenB; j++) {
    const item = copyB[j];
    actions.push({
      operation: "add",
      item
    });
    remaining.push(item);
  }

  return {
    actions,
    remaining
  };
};

export default ({ prevEffects, dragger }, ctx, actions) => {
  const { placedAt, hooks, impact } = ctx;

  const {
    downstreamDraggers: nextDownstreamDraggers,
    upstreamDraggers: nextUpstreamDraggers,
    impactContainer: nextImpactContainer
  } = impact;

  const { container: targetContainer } = candidatePositionDragger;

  const {
    upstreamDraggers,
    downstreamDraggers,
    impactContainer,
    containerEffects,
    upstreamDraggersEffect,
    downstreamDraggersEffect
  } = prevEffects;

  const {
    actions: diffImpactContainer,
    remaining: remainingImpactContainer
  } = diff(impactContainer, nextImpactContainer);
  const {
    actions: diffUpstreamDraggers,
    remaining: remainingUpstreamDraggers
  } = diff(upstreamDraggers, nextUpstreamDraggers);
  const {
    actions: diffDownstreamDraggers,
    remaining: remainingDownstreamDraggers
  } = diff(downstreamDraggers, nextDownstreamDraggers);

  const diffImpactContainerLength = diffImpactContainer.length;
  const diffUpstreamDraggersLength = diffUpstreamDraggers.length;
  const diffDownstreamDraggersLength = diffDownstreamDraggers.length;

  const pendingCleanupImpactContainerEffect = [];
  const pendingCleanupUpstreamDraggersEffect = [];
  const pendingCleanupDownstreamDraggersEffect = [];
  const pendingImpactContainerEffect = [];
  const pendingUpstreamDraggersEffect = [];
  const pendingDownstreamDraggersEffect = [];

  for (let i = 0; i < diffImpactContainerLength; i++) {
    const action = diffImpactContainer[i];
    const { operation, item } = action;
    const itemId = item.id;

    if (operation === "remove") {
      const index = containerEffects.findIndex(
        ({ container }) => container.id === itemId
      );
      if (index !== -1)
        pendingCleanupImpactContainerEffect.push(
          containerEffects.splice(index, 1)[0]
        );
    }

    if (operation === "add") {
      pendingImpactContainerEffect.push(item);
    }
  }

  for (let i = 0; i < diffUpstreamDraggersLength; i++) {
    const action = diffUpstreamDraggers[i];
    const { operation, item } = action;
    const itemId = item.id;

    if (operation === "remove") {
      const index = upstreamDraggersEffect.findIndex(
        ({ dragger }) => dragger.id === itemId
      );
      if (index !== -1)
        pendingCleanupUpstreamDraggersEffect.push(
          upstreamDraggersEffect.splice(index, 1)[0]
        );
    }

    if (operation === "add") {
      pendingUpstreamDraggersEffect.push(item);
    }
  }

  for (let i = 0; i < diffDownstreamDraggersLength; i++) {
    const action = diffDownstreamDraggers[i];
    const { operation, item } = action;
    const itemId = item.id;

    if (operation === "remove") {
      const index = downstreamDraggersEffect.findIndex(
        ({ dragger }) => dragger.id === itemId
      );
      if (index !== -1)
        pendingCleanupDownstreamDraggersEffect.push(
          downstreamDraggersEffect.splice(index, 1)[0]
        );
    }

    if (operation === "add") {
      pendingDownstreamDraggersEffect.push(item);
    }
  }

  pendingCleanupImpactContainerEffect.forEach(({ teardown, container }) => {
    DEBUG && reporter.logRemoveEffect(container);
    isFunction(teardown) && teardown();
  });
  pendingCleanupUpstreamDraggersEffect.forEach(({ teardown, dragger }) => {
    DEBUG && reporter.logRemoveEffect(dragger);
    isFunction(teardown) && teardown();
  });
  pendingCleanupDownstreamDraggersEffect.forEach(({ teardown, dragger }) => {
    DEBUG && reporter.logRemoveEffect(dragger);
    isFunction(teardown) && teardown();
  });

  const newImpactContainerEffect = pendingImpactContainerEffect.map(item => {
    const {
      containerConfig: { containerEffect }
    } = targetContainer;

    const teardown = containerEffect({
      el: item.el,
      draggerElement: dragger.el
    });

    DEBUG && reporter.logAddEffect(item);

    return {
      container: item,
      teardown
    };
  });

  const newUpstreamDraggersEffect = pendingUpstreamDraggersEffect.map(item => {
    const {
      containerConfig: { draggerEffect }
    } = targetContainer;

    const teardown = draggerEffect({
      el: item.el,
      draggerElement: dragger.el,
      vNode: item,
      placedAtIndex: placedAt.index,
      operation: placedAt.operation,
      dimension: item.dimension.rect,
      isHighlightItem: impactDragger.id === item.id,
      tailing,
      needMove: true
    });
    DEBUG && reporter.logAddEffect(item);
    return {
      dragger: item,
      teardown
    };
  });

  const newDownstreamDraggersEffect = pendingDownstreamDraggersEffect.map(
    item => {
      const {
        containerConfig: { draggerEffect }
      } = targetContainer;

      const teardown = draggerEffect({
        el: item.el,
        draggerElement: dragger.el,
        vNode: item,
        placedAtIndex: placedAt.index,
        operation: placedAt.operation,
        dimension: item.dimension.rect,
        isHighlightItem: impactDragger.id === item.id,
        tailing,
        needMove: true
      });
      DEBUG && reporter.logAddEffect(item);
      return {
        dragger: item,
        teardown
      };
    }
  );

  hooks.syncEffects.call({
    effects: {
      impactContainerEffects: [
        ...containerEffects,
        ...newImpactContainerEffect
      ],
      upstreamDraggersEffect: [
        ...upstreamDraggersEffect,
        ...newUpstreamDraggersEffect
      ],
      downstreamDraggersEffect: [
        ...downstreamDraggersEffect,
        ...newDownstreamDraggersEffect
      ],
      impactContainer: remainingImpactContainer,
      upstreamDraggers: remainingUpstreamDraggers,
      downstreamDraggers: remainingDownstreamDraggers
    }
  });

  actions.next();
};
