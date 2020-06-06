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

export const findClosestContainer = (containers, el) => {
  const directParent = closest(el, '[data-is-container="true"]');
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
export const findClosestDroppableContainerFromEvent = (event, containers) => {
  let node = event.target;
  let container;

  while ((container = findClosestContainer(containers, node)) !== -1) {
    const { dndConfig } = container;
    if (node.matches(dndConfig.draggerSelector)) return container;
    else node = container.el;
  }

  return -1;
};

export const findClosestDraggerFromEvent = event => {
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
