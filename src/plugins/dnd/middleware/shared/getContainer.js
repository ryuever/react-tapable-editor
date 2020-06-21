const shouldAcceptDragger = (containerConfig, dragger) => {
  const { draggerSelector, shouldAcceptDragger } = containerConfig;
  const { el } = dragger;
  if (typeof shouldAcceptDragger === "function") {
    return shouldAcceptDragger(el);
  }

  return el.matches(draggerSelector);
};

const pickClosestContainer = pendingContainers => {
  const len = pendingContainers.length;
  if (len <= 1) return pendingContainers[0];
  const isVerified = Object.create(null);

  for (let i = 0; i < len; i++) {
    let container = pendingContainers[i];
    const containerId = container.id;
    if (typeof isVerified[containerId] !== "undefined") {
      break;
    }

    isVerified[containerId] = {
      used: true,
      container
    };

    let parentContainer = container.parentContainer;

    while (parentContainer) {
      const parentContainerId = parentContainer.id;
      if (typeof isVerified[parentContainerId] !== "undefined") {
        parentContainer = null;
      } else {
        parentContainer = parentContainer.parentContainer;
      }
      isVerified[parentContainerId].used = false;
    }
  }

  const remaining = [];

  for (let [key, value] of Object.entries(isVerified)) {
    if (value.used) remaining.push(value.container);
  }

  return remaining[0];
};

const getContainer = ({ event, dragger }, ctx, actions) => {
  const { clientX, clientY } = event;
  const { containers, dndConfig } = ctx;
  const { mode } = dndConfig;
  const keys = Object.keys(containers);
  const len = keys.length;
  const pendingContainers = [];

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const container = containers[key];
    const {
      dimension: { within },
      containerConfig
    } = container;
    const point = [clientX, clientY];
    if (within(point) && shouldAcceptDragger(containerConfig, dragger)) {
      pendingContainers.push(container);
    }
  }

  let nextContainer = pendingContainers;

  // in `nested` mode, `horizontal` container is not considered
  if (mode === "nested") {
    nextContainer = pendingContainers.filter(container => {
      const { orientation } = container.containerConfig;
      return orientation === "vertical";
    });
  }

  ctx.targetContainer = pickClosestContainer(nextContainer);
  actions.next();
};

export default getContainer;
