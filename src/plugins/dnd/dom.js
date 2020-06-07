// https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object
export const isElement = el =>
  el instanceof Element || el instanceof HTMLDocument;

export const clamped = (value, min, max) => value >= min && value <= max;

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

export const getViewport = () => {
  const { innerHeight, innerWidth } = window;
  const { clientHeight, clientWidth } = document.documentElement;

  return {
    top: 0,
    right: innerWidth || clientWidth,
    bottom: innerHeight || clientHeight,
    left: 0
  };
};

// https://stackoverflow.com/a/7557433/2006805
export const isElementInViewport = el => {
  const rect = el.getBoundingClientRect();
  const viewport = getViewport();

  return (
    rect.top >= viewport.top &&
    rect.left >= viewport.left &&
    rect.bottom <= viewport.bottom &&
    rect.right <= viewport.right
  );
};

export const isElementVisibleInViewport = el => {
  const viewport = getViewport();
  const rect = el.getBoundingClientRect();
  return intersect(viewport, rect);
};

// https://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
// https://stackoverflow.com/questions/16005136/how-do-i-see-if-two-rectangles-intersect-in-javascript-or-pseudocode/29614525
// https://codereview.stackexchange.com/questions/185323/find-the-intersect-area-of-two-overlapping-rectangles
// https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
// https://silentmatt.com/rectangle-intersection/
export const intersect = (a, b) => {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
};

export const coincide = (a, b) => {
  return (
    a.left === b.left &&
    a.right === b.right &&
    a.top === b.top &&
    a.bottom === b.bottom
  );
};

export const contains = (a, b) => {
  return containsRight(a, b) || containsRight(b, a);
};

export const containsRight = (a, b) => {
  return (
    a.top < b.top && a.right > b.right && a.bottom > b.bottom && a.left < b.left
  );
};

export const within = (rect, point) => {
  const [clientX, clientY] = point;
  const { top, right, bottom, left } = rect;

  return clamped(clientX, left, right) && clamped(clientY, top, bottom);
};

// Has rect cache.. If container's rect is not update.
// It is recommended to use this method
export const withinElement = el => {
  const rect = el.getBoundingClientRect();
  return point => within(rect, point);
};
