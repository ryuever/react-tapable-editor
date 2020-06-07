const shouldAcceptDragger = (containerConfig, dragger) => {
  const { draggerSelector, shouldAcceptDragger } = containerConfig;
  const { el } = dragger;
  if (typeof shouldAcceptDragger === "function") {
    return shouldAcceptDragger(el);
  }

  return el.matches(draggerSelector);
};

const getContainer = ({ event, dragger }, ctx, actions) => {
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

export default getContainer;
