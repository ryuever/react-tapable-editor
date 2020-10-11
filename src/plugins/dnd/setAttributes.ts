import { ResultConfig, DraggersMap, ContainersMap, Point } from '../../types';
import Container from './Container';
import Dragger from './Dragger';
import closest from './closest';

export const draggerSelector = '[data-is-dragger="true"]';
export const containerSelector = '[data-is-container="true"]';

export const isCloneElement = (el: HTMLElement): boolean => {
  const attributeValue = el.getAttribute('data-is-clone');
  return Boolean(attributeValue);
};

export const setCloneAttributes = (el: HTMLElement) => {
  el.setAttribute('data-is-clone', 'true');
  const { children } = el;
  const len = children.length;
  if (len) {
    for (let i = 0; i < len; i++) {
      setCloneAttributes(children[i] as HTMLElement);
    }
  }
};

export const setContainerAttributes = (
  container: Container,
  config: ResultConfig
) => {
  const { orientation } = config;
  const { id } = container;
  const { el } = container;

  el.setAttribute('data-is-container', 'true');
  el.setAttribute('data-container-id', id);
  el.setAttribute('data-orientation', orientation);
};

export const setDraggerAttributes = (
  container: Container,
  dragger: Dragger
) => {
  const containerId = container.id;
  const draggerId = dragger.id;
  const { el } = dragger;
  el.setAttribute('data-is-dragger', 'true');
  el.setAttribute('data-dragger-id', draggerId);
  el.setAttribute('data-container-context', containerId);
};

export const getVDraggerId = (draggerNode: HTMLElement) => {
  return draggerNode.getAttribute('data-dragger-id');
};

export const getVDragger = (
  draggerNode: HTMLElement,
  vDraggers: DraggersMap
) => {
  const vDraggerId = getVDraggerId(draggerNode);
  if (vDraggerId) return vDraggers[vDraggerId];
  return null;
};

export const getVContainerId = (containerNode: HTMLElement) => {
  return containerNode.getAttribute('data-container-id');
};

export const getVContainer = (
  containerNode: HTMLElement,
  vContainers: ContainersMap
) => {
  const vContainerId = getVContainerId(containerNode);
  if (vContainerId) return vContainers[vContainerId];
  return null;
};

// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint
export const draggerElementFromPoint = (point: Point) => {
  // const root = document.querySelector('.DraftEditor-root')
  const [x, y] = point;
  const elements = document.elementsFromPoint(x, y);
  if (!elements) return null;

  const len = elements.length;
  let candidate = null;

  for (let i = 0; i < len; i++) {
    const node = elements[i] as HTMLElement;
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
export const containerElementFromPoint = (point: Point) => {
  // const root = document.querySelector('.DraftEditor-root')
  const [x, y] = point;
  const elements = document.elementsFromPoint(x, y);
  if (!elements) return null;

  console.log('elements ', elements);

  const len = elements.length;
  let candidate = null;

  // 0 -> n <=> inner -> outer
  for (let i = 0; i < len; i++) {
    const node = elements[i] as HTMLElement;
    if (!isCloneElement(node)) {
      candidate = node;
      break;
    }
  }

  console.log('candidate ', candidate, closest(candidate, containerSelector));

  // Maybe closest is not needed... loop `elements` util find the first
  // element matches dragger selector.
  return closest(candidate, containerSelector);
};

export const closestDraggerElementFromElement = (el: HTMLElement) => {
  return closest(el, draggerSelector);
};

export const closestExclusiveContainerNodeFromElement = (
  el: HTMLElement
): HTMLElement | null => {
  const parent = el.parentNode as HTMLElement;
  if (parent) return closest(parent, containerSelector);
  return null;
};
