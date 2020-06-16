import {
  orientationToAxis,
  axisMeasure,
  isClamped,
  axisClientMeasure
} from "../../utils";

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

  for (let i = 0; i < len; i++) {
    const child = children.getItem(i);
    const [min, max] = axisMeasure[axis];
    const { [min]: minValue, [max]: maxValue } = child.dimension.rect;

    if (!isClamped(clientValue, minValue, maxValue)) break;
    placedAtRaw = {
      index: i,
      dragger: child,
      isLast: false
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
