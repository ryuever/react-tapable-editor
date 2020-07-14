// only resolve the style of container or dragger enclosed by container.
import { isElementVisibleInViewport, withinElement } from '../../dom';
import { Action } from 'sabar';
import { OnStartHandlerContext } from 'types';
import Container from '../../Container';
import Dragger from '../../Dragger';

const getDimension = (v: Container | Dragger) => {
  const { el } = v;
  const rect = el.getBoundingClientRect();
  return rect;
};

// If it is a container, subject property may be required which will indicate
// whether it is visible or not.
const getSubject = (el: HTMLElement) => {
  return {
    isVisible: isElementVisibleInViewport(el),
  };
};

export default (ctx: object, actions: Action) => {
  const context = ctx as OnStartHandlerContext;
  const { vDraggers, vContainers } = context;
  const draggerKeys = Object.keys(vDraggers);
  const containerKeys = Object.keys(vContainers);

  draggerKeys.forEach(key => {
    const dragger = vDraggers[key];
    const rect = getDimension(dragger);
    dragger.dimension = {
      rect,
    };
  });

  containerKeys.forEach(key => {
    const container = vContainers[key];
    const rect = getDimension(container);
    container.dimension = {
      rect,
      subject: getSubject(container.el),
      within: withinElement(container.el),
    };
  });

  actions.next();
};
