import closest from './closest';

export const draggerSelector = '[data-is-dragger="true"]';
export const containerSelector = '[data-is-container="true"]';

export const isCloneElement = el => {
  const attributeValue = el.getAttribute('data-is-clone');
  return Boolean(attributeValue);
};

export const setCloneAttributes = el => {
  el.setAttribute('data-is-clone', 'true');
  const { children } = el;
  const len = children.length;
  if (len) {
    for (let i = 0; i < len; i++) {
      setCloneAttributes(children[i]);
    }
  }
};

export const setContainerAttributes = (container, config) => {
  const { orientation } = config;
  const { id } = container;
  const { el } = container;

  el.setAttribute('data-is-container', 'true');
  el.setAttribute('data-container-id', id);
  el.setAttribute('data-orientation', orientation);
};

export const setDraggerAttributes = (container, dragger) => {
  const containerId = container.id;
  const draggerId = dragger.id;
  const { el } = dragger;
  el.setAttribute('data-is-dragger', 'true');
  el.setAttribute('data-dragger-id', draggerId);
  el.setAttribute('data-container-context', containerId);
};

export const getVDraggerId = draggerNode => {
  return draggerNode.getAttribute('data-dragger-id');
};

export const getVDragger = (draggerNode, vDraggers) => {
  const vDraggerId = getVDraggerId(draggerNode);
  if (vDraggerId) return vDraggers[vDraggerId];
  return null;
};

export const getVContainerId = containerNode => {
  return containerNode.getAttribute('data-container-id');
};

export const getVContainer = (containerNode, vContainers) => {
  const vContainerId = getVContainerId(containerNode);
  if (vContainerId) return vContainers[vContainerId];
  return null;
};

// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint
export const draggerElementFromPoint = point => {
  // const root = document.querySelector('.DraftEditor-root')
  const [x, y] = point;
  const elements = document.elementsFromPoint(x, y);
  if (!elements) return null;

  const len = elements.length;
  let candidate = null;

  for (let i = 0; i < len; i++) {
    const node = elements[i];
    if (!isCloneElement(node)) {
      candidate = node;
      break;
    }
  }

  // Maybe closest is not needed... loop `elements` util find the first
  // element matches dragger selector.
  return closest(candidate, draggerSelector);
};

// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint
export const containerElementFromPoint = point => {
  // const root = document.querySelector('.DraftEditor-root')
  const [x, y] = point;
  const elements = document.elementsFromPoint(x, y);
  if (!elements) return null;

  const len = elements.length;
  let candidate = null;

  for (let i = 0; i < len; i++) {
    const node = elements[i];
    if (!isCloneElement(node)) {
      candidate = node;
      break;
    }
  }

  // Maybe closest is not needed... loop `elements` util find the first
  // element matches dragger selector.
  return closest(candidate, containerSelector);
};

export const closestDraggerElementFromElement = el => {
  return closest(el, draggerSelector);
};

export const closestExclusiveContainerNodeFromElement = el => {
  const parent = el.parentNode;
  if (parent) return closest(parent, containerSelector);
};
