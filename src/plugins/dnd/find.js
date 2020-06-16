import closest from "./closest";

export function findIndex(list, predicate) {
  if (list.findIndex) {
    return list.findIndex(predicate);
  }

  // Using a for loop so that we can exit early
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      return i;
    }
  }

  // Array.prototype.find returns -1 when nothing is found
  return -1;
}

export function find(list, predicate) {
  if (list.find) {
    return list.find(predicate);
  }
  const index = findIndex(list, predicate);
  if (index !== -1) {
    return list[index];
  }
  // Array.prototype.find returns undefined when nothing is found
  return undefined;
}

// `closest` will return itself if self matches selector.
// So, it needs support condition in which self should be excluded.
export const findClosestContainer = (containers, el, strictMode) => {
  const node = strictMode ? el.parentNode : el;

  const directParent = closest(node, '[data-is-container="true"]');
  const containerKeys = Object.keys(containers);
  const len = containerKeys.length;

  for (let i = 0; i < len; i++) {
    const key = containerKeys[i];
    const container = containers[key];
    if (container.el === directParent) return container;
  }

  return -1;
};

/**
 *
 * @param {Event} event
 * @param {Object} containers
 *
 */
export const findClosestDropTargetFromEvent = (event, containers) => {
  let node = event.target;
  let container;

  while (
    (container = findClosestContainer(containers, node)) !== -1 &&
    node !== document.body
  ) {
    const { dndConfig } = container;
    if (node.matches(dndConfig.draggerSelector)) return container;
    // current node will be resolved if it matches selector...
    // So we should use its parentNode for next processing..
    else node = container.el.parentNode;
  }

  return -1;
};

export const findClosestDraggerElementFromEvent = event => {
  const target = event.target;
  const dragger = closest(target, '[data-is-dragger="true"]');
  if (dragger) return dragger;
  return -1;
};

export const findClosestContainerFromEvent = event => {
  const target = event.target;
  const container = closest(target, '[data-is-container="true"]');
  if (container) return container;
  return -1;
};
