// Append `collisionRect` to dimension property.
// `getDimension` method should be considered.

import { orientationToAxis, axisMeasure } from "../../utils";

export default (_, ctx, actions) => {
  const { draggers, dndConfig } = ctx;
  const { mode, collisionPadding } = dndConfig;

  if (mode !== "nested") {
    actions.next();
    return;
  }

  // Only if under `nested` mode, `dimension` should be appended with
  // `collisionRect` property.

  const nextDraggers = {};

  for (let key in draggers) {
    const dragger = draggers[key];
    const { container, dimension } = dragger;
    const { rect } = dimension;
    const { top, right, bottom, left } = rect;
    const { containerConfig } = container;
    const { orientation } = containerConfig;
    const axis = orientationToAxis[orientation];
    const [first, second] = axisMeasure[axis];

    const firstCollisionRect = {
      top,
      right,
      bottom,
      left,
      [first]: Math.max(rect[first] - collisionPadding, 0),
      [second]: rect[first]
    };

    const secondCollisionRect = {
      top,
      right,
      bottom,
      left,
      [first]: rect[second],
      [second]: rect[second] + collisionPadding
    };

    dragger.dimension = {
      ...dimension,
      firstCollisionRect,
      secondCollisionRect
    };
  }
  console.log("ctx ", ctx);

  actions.next();
};
