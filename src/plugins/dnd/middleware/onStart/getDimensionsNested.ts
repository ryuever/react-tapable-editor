// Append `collisionRect` to dimension property.
// `getDimension` method should be considered.

import { orientationToAxis, axisMeasure } from '../../utils';
import { OnStartHandlerContext } from '../../../../types';
import { Action } from 'sabar';

export default (ctx: object, actions: Action) => {
  const context = ctx as OnStartHandlerContext;
  const { vDraggers, dndConfig } = context;
  const { mode, collisionPadding = 0 } = dndConfig;

  if (mode !== 'nested') {
    actions.next();
    return;
  }

  // Only if under `nested` mode, `dimension` should be appended with
  // `collisionRect` property.
  for (const key in vDraggers) {
    const dragger = vDraggers[key];
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
      [second]: rect[first],
    };

    const secondCollisionRect = {
      top,
      right,
      bottom,
      left,
      [first]: rect[second],
      [second]: rect[second] + collisionPadding,
    };

    dragger.dimension = {
      ...dimension,
      firstCollisionRect,
      secondCollisionRect,
    };
  }

  actions.next();
};
