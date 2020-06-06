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
