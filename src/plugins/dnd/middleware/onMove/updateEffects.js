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
  const { placedAt, hooks } = ctx;
  const { index, candidatePositionDragger } = placedAt;

  if (!candidatePositionDragger) {
    actions.next();
    return;
  }

  // Do not have position to place. If there are pending effects, then do these first.
  if (!placedAt || typeof placedAt.index === "undefined") {
    // do pending effects
    actions.next();
    return;
  }

  const { container: targetContainer } = candidatePositionDragger;
  const { children } = targetContainer;

  // Items behind index should be reconsidered.
  const nextDraggers = children.slice(index);
  const highlightItem = nextDraggers[0];

  const nextContainer = [].concat(targetContainer);
  const {
    draggers,
    containers,
    containerEffects,
    draggerEffects
  } = prevEffects;

  const { actions: diffContainer, remaining: remainingContainer } = diff(
    containers,
    nextContainer
  );
  const { actions: diffDraggers, remaining: remainingDraggers } = diff(
    draggers,
    nextDraggers
  );

  const diffContainerLength = diffContainer.length;
  const diffDraggersLength = diffDraggers.length;

  const pendingCleanupContainerEffects = [];
  const pendingCleanupDraggerEffects = [];
  const pendingContainerEffects = [];
  const pendingDraggerEffects = [];

  for (let i = 0; i < diffContainerLength; i++) {
    const action = diffContainer[i];
    const { operation, item } = action;
    const itemId = item.id;

    if (operation === "remove") {
      const index = containerEffects.findIndex(
        ({ container }) => container.id === itemId
      );
      if (index !== -1)
        pendingCleanupContainerEffects.push(
          containerEffects.splice(index, 1)[0]
        );
    }

    if (operation === "add") {
      pendingContainerEffects.push(item);
    }
  }

  for (let i = 0; i < diffDraggersLength; i++) {
    const action = diffDraggers[i];
    const { operation, item } = action;
    const itemId = item.id;

    if (operation === "remove") {
      const index = draggerEffects.findIndex(
        ({ dragger }) => dragger.id === itemId
      );
      if (index !== -1)
        pendingCleanupDraggerEffects.push(draggerEffects.splice(index, 1)[0]);
    }

    if (operation === "add") {
      pendingDraggerEffects.push(item);
    }
  }

  pendingCleanupContainerEffects.forEach(({ teardown, container }) => {
    DEBUG && reporter.logRemoveEffect(container);
    isFunction(teardown) && teardown();
  });
  pendingCleanupDraggerEffects.forEach(({ teardown, dragger }) => {
    DEBUG && reporter.logRemoveEffect(dragger);
    isFunction(teardown) && teardown();
  });

  const newContainerEffects = pendingContainerEffects.map(item => {
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

  const newDraggerEffects = pendingDraggerEffects.map(item => {
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
      isHighlightItem: highlightItem.id === item.id
    });
    DEBUG && reporter.logAddEffect(item);
    return {
      dragger: item,
      teardown
    };
  });

  hooks.syncEffects.call({
    effects: {
      containerEffects: [...containerEffects, ...newContainerEffects],
      draggerEffects: [...draggerEffects, ...newDraggerEffects],
      containers: remainingContainer,
      draggers: remainingDraggers
    }
  });

  actions.next();
};
