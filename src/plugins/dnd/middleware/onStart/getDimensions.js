// only resolve the style of container or dragger enclosed by container.
import { isElementVisibleInViewport, withinElement } from '../../dom';

const getDimension = v => {
  const { el } = v;
  const rect = el.getBoundingClientRect();
  return rect;
};

// If it is a container, subject property may be required which will indicate
// whether it is visible or not.
const getSubject = el => {
  return {
    isVisible: isElementVisibleInViewport(el),
  };
};

export default (_, ctx, actions) => {
  const { draggers, containers } = ctx;
  const draggerKeys = Object.keys(draggers);
  const containerKeys = Object.keys(containers);

  draggerKeys.forEach(key => {
    const dragger = draggers[key];
    const rect = getDimension(dragger);
    dragger.dimension = {
      rect,
    };
  });

  containerKeys.forEach(key => {
    const container = containers[key];
    const rect = getDimension(container);
    container.dimension = {
      rect,
      subject: getSubject(container.el),
      within: withinElement(container.el),
    };
  });

  actions.next();
};
