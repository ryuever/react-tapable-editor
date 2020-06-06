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
  const { overlappingContainer } = ctx;
  const placedAtRaw = {
    rawIndex: undefined
  };
  if (!overlappingContainer) {
    actions.next();
    return;
  }

  const { orientation, children } = overlappingContainer;

  const axis = orientationToAxis[orientation];
  const len = children.getSize();
  const clientValue = event[axisClientMeasure[axis]];

  for (let i = 0; i < len; i++) {
    const child = children.getItem(i);
    const [min, max] = axisMeasure[axis];
    const { [min]: minValue, [max]: minValue } = child.dimension;

    if (!isClamped(clientValue, minValue, minValue)) break;
    placedAtRaw = {
      index: i,
      dragger: child,
      isLast: false
    };
    ctx.placedAtRaw = placedAtRaw;
    actions.next();
    return;
  }

  placedAtRaw = {
    index: i + i,
    dragger: null,
    isLast: true
  };

  actions.next();
};
