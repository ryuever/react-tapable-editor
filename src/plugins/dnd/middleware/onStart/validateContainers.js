const contains = (a, b) => {
  const { top: aTop, right: aRight, bottom: aBottom, left: aLeft } = a;

  const { top: bTop, right: bRight, bottom: bBottom, left: bLeft } = b;

  return aTop < bTop && aRight > bRight && aBottom > bBottom && aLeft < bLeft;
};

// https://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
// https://stackoverflow.com/questions/16005136/how-do-i-see-if-two-rectangles-intersect-in-javascript-or-pseudocode/29614525
// https://codereview.stackexchange.com/questions/185323/find-the-intersect-area-of-two-overlapping-rectangles
const intersect = (a, b) => {
  return (
    a.left <= b.right &&
    a.right >= b.left &&
    a.top <= b.bottom &&
    a.bottom >= b.top
  );
};

/**
 * 1. Container should be enclosed by other container entirely.
 * 2. Container should be on the outer of other container.
 * 3. The intersection of containers is not allowed.
 */

export default (_, ctx, actions) => {
  const { containers } = ctx;

  const keys = Object.keys(containers);
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const a = containers[i];
      const b = containers[j];
      if (intersect(a, b)) {
        throw new Error("The interaction of containers is forbidden");
      }
    }
  }

  actions.next();
};
