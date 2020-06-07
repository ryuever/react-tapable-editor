const shouldAcceptDragger = (containerConfig, dragger) => {
  const { draggerSelector, shouldAcceptDragger } = containerConfig;

  if (dragger.el.matches(draggerSelector)) {
    if (typeof shouldAcceptDragger === "function") {
      return shouldAcceptDragger();
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const getDropTarget = ({ event, dragger }, ctx, actions) => {
  const { clientX, clientY } = event;
  const { containers } = ctx;
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

  actions.next();
};

export default getDropTarget;
