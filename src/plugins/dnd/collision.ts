// https://stackoverflow.com/questions/2752349/fast-rectangle-to-rectangle-intersection
// https://stackoverflow.com/questions/16005136/how-do-i-see-if-two-rectangles-intersect-in-javascript-or-pseudocode/29614525
// https://codereview.stackexchange.com/questions/185323/find-the-intersect-area-of-two-overlapping-rectangles
// https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other

import { RectObject, Point, Position, Triangle } from '../../types';

// https://silentmatt.com/rectangle-intersection/
export const intersect = (a: RectObject, b: RectObject) => {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
};

export const overlapOnVerticalEdge = (a: RectObject, b: RectObject) => {
  return Math.abs(b.right - a.left) === a.right - a.left + b.right - b.left;
};

export const overlapOnHorizontalEdge = (a: RectObject, b: RectObject) => {
  return Math.abs(b.bottom - a.top) === a.bottom - a.top + b.bottom - b.top;
};

export const overlapOnEdge = (a: RectObject, b: RectObject) => {
  return overlapOnHorizontalEdge(a, b) || overlapOnVerticalEdge(a, b);
};

export const clamped = (value: number, min: number, max: number) =>
  value >= min && value <= max;

export const coincide = (a: RectObject, b: RectObject) => {
  return (
    a.left === b.left &&
    a.right === b.right &&
    a.top === b.top &&
    a.bottom === b.bottom
  );
};

export const contains = (a: RectObject, b: RectObject) => {
  return containsRight(a, b) || containsRight(b, a);
};

export const containsRight = (a: RectObject, b: RectObject) => {
  return (
    a.top < b.top && a.right > b.right && a.bottom > b.bottom && a.left < b.left
  );
};

export const within = (rect: RectObject, point: Point) => {
  const [clientX, clientY] = point;
  const { top, right, bottom, left } = rect;

  return clamped(clientX, left, right) && clamped(clientY, top, bottom);
};

export const pointInRectWithOrientation = (
  point: Point,
  rect: RectObject,
  orientation = 'vertical'
): Position | null => {
  const { top, right, bottom, left } = rect;

  if (orientation === 'vertical') {
    const topPart = { top, right, bottom: top + (bottom - top) / 2, left };
    const bottomPart = { top: top + (bottom - top) / 2, right, bottom, left };

    if (within(topPart, point)) return Position.Top;
    if (within(bottomPart, point)) return Position.Bottom;
  } else {
    const leftPart = { top, right: left + (right - left) / 2, bottom, left };
    const rightPart = { top, right, bottom, left: left + (right - left) / 2 };

    if (within(leftPart, point)) return Position.Left;
    if (within(rightPart, point)) return Position.Right;
  }

  return null;
};

export const pointInCenter = (rect: RectObject) => {
  const { top, right, bottom, left } = rect;

  return [left + (right - left) / 2, top + (bottom - top) / 2];
};

// point in polygon https://stackoverflow.com/questions/46634887/javascript-point-in-polygon-performance-improvement
// Point in triangle: https://blackpawn.com/texts/pointinpoly/default.html
// https://github.com/mattdesl/point-in-triangle/blob/master/index.js
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Collision_detection

export const positionInRect = (
  point: Point,
  rect: RectObject
): Position | null => {
  const { top, right, bottom, left } = rect;
  const centerPoint = pointInCenter(rect);

  const scope = [
    {
      position: Position.Top,
      points: [[left, top], [right, top], centerPoint],
    },
    {
      position: Position.Right,
      points: [[right, top], centerPoint, [right, bottom]],
    },
    {
      position: Position.Bottom,
      points: [centerPoint, [left, bottom], [right, bottom]],
    },
    {
      position: Position.Left,
      points: [[left, top], centerPoint, [left, bottom]],
    },
  ];

  for (let i = 0; i < scope.length; i++) {
    const item = scope[i];
    const { position, points } = item;
    if (pointInTriangle(point, points as Triangle)) return position;
  }

  return null;
};

// http://www.blackpawn.com/texts/pointinpoly/
const pointInTriangle = (point: Point, triangle: Triangle): boolean => {
  // compute vectors & dot products
  const cx = point[0];
  const cy = point[1];
  const t0 = triangle[0];
  const t1 = triangle[1];
  const t2 = triangle[2];
  const v0x = t2[0] - t0[0];
  const v0y = t2[1] - t0[1];
  const v1x = t1[0] - t0[0];
  const v1y = t1[1] - t0[1];
  const v2x = cx - t0[0];
  const v2y = cy - t0[1];
  const dot00 = v0x * v0x + v0y * v0y;
  const dot01 = v0x * v1x + v0y * v1y;
  const dot02 = v0x * v2x + v0y * v2y;
  const dot11 = v1x * v1x + v1y * v1y;
  const dot12 = v1x * v2x + v1y * v2y;

  // Compute barycentric coordinates
  const b = dot00 * dot11 - dot01 * dot01;
  const inv = b === 0 ? 0 : 1 / b;
  const u = (dot11 * dot02 - dot01 * dot12) * inv;
  const v = (dot00 * dot12 - dot01 * dot02) * inv;
  return u >= 0 && v >= 0 && u + v < 1;
};
