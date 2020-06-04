import closest from "./closest";

// https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object
export const isElement = el =>
  el instanceof Element || el instanceof HTMLDocument;

export const matchesDragger = (el, configs) => {
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

export const matchesContainer = (el, configs) => {
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

export const findClosestDraggerFromEvent = event => {
  const target = event.target;
  const dragger = closest(target, '[data-is-dragger="true"]');
  if (dragger) return dragger;
  return -1;
};

export const findClosestContainerFromEvent = event => {
  const target = event.target;
  const dragger = closest(target, '[data-is-container="true"]');
  if (dragger) return dragger;
  return -1;
};
