import {
  orientationToAxis,
  axisMeasure,
  isClamped,
  axisClientMeasure
} from "../../utils";
import { positionInRect } from "../../collision";

/**
 * According to event target position to find the placed index.
 */
export default ({ event }, ctx, actions) => {
  const { targetContainer } = ctx;
  let placedAtRaw = {
    rawIndex: undefined
  };
  if (!targetContainer) {
    actions.next();
    return;
  }

  const {
    containerConfig: { orientation },
    children
  } = targetContainer;
  const axis = orientationToAxis[orientation];
  const len = children.getSize();
  const clientValue = event[axisClientMeasure[axis]];

  // TODO: start from index 0 is not a goods solution, which may cause
  // performance issue. Binary search or interval tree could be a better choice
  for (let i = 0; i < len; i++) {
    const child = children.getItem(i);
    const [min, max] = axisMeasure[axis];
    const rect = child.dimension.rect;
    const { [min]: minValue, [max]: maxValue } = rect;
    if (!isClamped(clientValue, minValue, maxValue)) continue;

    const position = positionInRect(
      [event.clientX, event.clientY],
      rect,
      orientation
    );

    placedAtRaw = {
      index: i,
      dragger: child,
      isLast: false,
      position
    };
    ctx.placedAtRaw = placedAtRaw;
    actions.next();
    return;
  }

  ctx.placedAtRaw = {
    index: len,
    dragger: null,
    isLast: true
  };

  actions.next();
};
