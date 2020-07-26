import { intersect, within } from './collision';
import { ResultConfig, Point } from '../../types';

// https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object
export const isElement = (el: any): boolean =>
  el instanceof Element || el instanceof HTMLDocument;

export const matchesDragger = (el: any, configs: ResultConfig[]) => {
  if (!isElement(el)) return -1;

  const len = configs.length;
  for (let i = 0; i < len; i++) {
    const config = configs[i];
    const { draggerSelector } = config;

    if (el.matches(draggerSelector)) {
      return config;
    }
  }

  return -1;
};

export const matchesContainer = (el: any, configs: ResultConfig[]) => {
  if (!isElement(el)) return -1;

  const len = configs.length;
  for (let i = 0; i < len; i++) {
    const config = configs[i];
    const { containerSelector } = config;
    if (el.matches(containerSelector)) {
      return config;
    }
  }

  return -1;
};

export const getViewport = () => {
  const { innerHeight, innerWidth } = window;
  const { clientHeight, clientWidth } = document.documentElement;

  return {
    top: 0,
    right: innerWidth || clientWidth,
    bottom: innerHeight || clientHeight,
    left: 0,
  };
};

// https://stackoverflow.com/a/7557433/2006805
export const isElementInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const viewport = getViewport();

  return (
    rect.top >= viewport.top &&
    rect.left >= viewport.left &&
    rect.bottom <= viewport.bottom &&
    rect.right <= viewport.right
  );
};

export const isElementVisibleInViewport = (el: HTMLElement) => {
  const viewport = getViewport();
  const rect = el.getBoundingClientRect();
  return intersect(viewport, rect);
};

// Has rect cache.. If container's rect is not update.
// It is recommended to use this method
export const withinElement = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return (point: Point) => within(rect, point);
};
