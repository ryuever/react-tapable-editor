import closest from "./closest";

export const matchesDragger = (el, configs) => {
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
