// only resolve the style of container or dragger enclosed by container.

const getDimension = v => {
  const el = v.el;
  const rect = el.getBoundingClientRect();
  return rect;
};

export default (_, ctx, actions) => {
  const { draggers, containers } = ctx;
  const draggerKeys = Object.keys(draggers);
  const containerKeys = Object.keys(containers);

  draggerKeys.forEach(key => {
    const dragger = draggers[key];
    const dimension = getDimension(dragger);
    dragger.dimension = dimension;
  });

  containerKeys.forEach(key => {
    const container = containers[key];
    const dimension = getDimension(container);
    container.dimension = dimension;
  });

  actions.next();
};
