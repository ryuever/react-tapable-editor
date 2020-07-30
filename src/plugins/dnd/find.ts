import { Containers, Predicator } from '../../types';
import closest from './closest';
import Container from './Container';

export function findIndex(list: any, predicate: Predicator) {
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

export function find(list: any, predicate: Predicator) {
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
export const findClosestContainer = (
  containers: Containers,
  el: HTMLElement | null,
  strictMode?: boolean
): -1 | Container => {
  if (!el) return -1;
  const node = strictMode ? el.parentNode : el;

  const directParent = closest(
    node as HTMLElement,
    '[data-is-container="true"]'
  );
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
export const findClosestDropTargetFromEvent = (
  event: Event,
  containers: Containers
) => {
  // ts-hint: event.target
  let node: HTMLElement | null = event.target as HTMLElement;
  let container;

  while (
    (container = findClosestContainer(containers, node)) !== -1 &&
    node !== document.body &&
    node
  ) {
    const { dndConfig } = container as Container;
    if (node.matches(dndConfig.draggerSelector as string)) return container;
    // current node will be resolved if it matches selector...
    // So we should use its parentNode for next processing..
    node = (container as Container).el.parentNode as HTMLElement;
  }

  return -1;
};

export const findClosestDraggerElementFromEvent = (event: Event) => {
  const { target } = event;
  const dragger = closest(target as HTMLElement, '[data-is-dragger="true"]');
  if (dragger) return dragger;
  return -1;
};

export const findClosestContainerFromEvent = (event: Event) => {
  const { target } = event;
  const container = closest(
    target as HTMLElement,
    '[data-is-container="true"]'
  );
  if (container) return container;
  return -1;
};
