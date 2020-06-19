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

export const clamped = (value, min, max) => value >= min && value <= max;

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

export const pointInRectWithOrientation = (
  point,
  rect,
  orientation = "vertical"
) => {
  const { top, right, bottom, left } = rect;

  if (orientation === "vertical") {
    const topPart = { top, right, bottom: top + (bottom - top) / 2, left };
    const bottomPart = { top: top + (bottom - top) / 2, right, bottom, left };

    if (within(topPart, point)) return "top";
    else if (within(bottomPart, point)) return "bottom";
  } else {
    const leftPart = { top, right: left + (right - left) / 2, bottom, left };
    const rightPart = { top, right, bottom, left: left + (right - left) / 2 };

    if (within(leftPart, point)) return "left";
    else if (within(rightPart, point)) return "right";
  }
};

export const pointInCenter = rect => {
  const { top, right, bottom, left } = rect;

  return [left + (right - left) / 2, top + (bottom - top) / 2];
};

// point in polygon https://stackoverflow.com/questions/46634887/javascript-point-in-polygon-performance-improvement
// Point in triangle: https://blackpawn.com/texts/pointinpoly/default.html
// https://github.com/mattdesl/point-in-triangle/blob/master/index.js
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Collision_detection

export const positionInRect = (point, rect) => {
  const { top, right, bottom, left } = rect;
  const centerPoint = pointInCenter(rect);

  const scope = [
    {
      position: "top",
      points: [[left, top], [right, top], centerPoint]
    },
    {
      position: "right",
      points: [[right, top], centerPoint, [right, bottom]]
    },
    {
      position: "bottom",
      points: [centerPoint, [left, bottom], [right, bottom]]
    },
    {
      position: "left",
      points: [[left, top], centerPoint, [left, bottom]]
    }
  ];

  for (let i = 0; i < scope.length; i++) {
    const item = scope[i];
    const { position, points } = item;
    if (pointInTriangle(point, points)) return position;
  }
};

// http://www.blackpawn.com/texts/pointinpoly/
const pointInTriangle = (point, triangle) => {
  // compute vectors & dot products
  const cx = point[0],
    cy = point[1],
    t0 = triangle[0],
    t1 = triangle[1],
    t2 = triangle[2],
    v0x = t2[0] - t0[0],
    v0y = t2[1] - t0[1],
    v1x = t1[0] - t0[0],
    v1y = t1[1] - t0[1],
    v2x = cx - t0[0],
    v2y = cy - t0[1],
    dot00 = v0x * v0x + v0y * v0y,
    dot01 = v0x * v1x + v0y * v1y,
    dot02 = v0x * v2x + v0y * v2y,
    dot11 = v1x * v1x + v1y * v1y,
    dot12 = v1x * v2x + v1y * v2y;

  // Compute barycentric coordinates
  const b = dot00 * dot11 - dot01 * dot01,
    inv = b === 0 ? 0 : 1 / b,
    u = (dot11 * dot02 - dot01 * dot12) * inv,
    v = (dot00 * dot12 - dot01 * dot02) * inv;
  return u >= 0 && v >= 0 && u + v < 1;
};
