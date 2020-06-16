/**
 * Effects is used to update the style of element. However, when its the time to
 * remove effects should be reconsidered.
 */
import reporter from "../../reporter";

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

export default ({ prevEffects }, ctx, actions) => {
  const { placedAt, targetContainer, hooks } = ctx;

  if (!targetContainer) {
    actions.next();
    return;
  }

  // Do not have position to place. If there are pending effects, then do these first.
  if (!placedAt) {
    // do pending effects
    actions.next();
    return;
  }

  const { index } = placedAt;
  const { children } = targetContainer;
  const nextDraggers = children.slice(index);
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
    reporter.logRemoveEffect(container);
    teardown();
  });
  pendingCleanupDraggerEffects.forEach(({ teardown, dragger }) => {
    reporter.logRemoveEffect(dragger);
    teardown();
  });

  const newContainerEffects = pendingContainerEffects.map(item => {
    const {
      containerConfig: { containerEffect }
    } = targetContainer;

    const teardown = containerEffect(item.el);

    reporter.logAddEffect(item);

    return {
      container: item,
      teardown
    };
  });

  const newDraggerEffects = pendingDraggerEffects.map(item => {
    const {
      containerConfig: { draggerEffect }
    } = targetContainer;
    const teardown = draggerEffect(item.el);
    reporter.logAddEffect(item);
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
