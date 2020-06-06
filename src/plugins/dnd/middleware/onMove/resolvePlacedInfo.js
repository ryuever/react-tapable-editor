import { orientationToAxis, axisMeasure } from "../../utils";

const operation = {
  REPLACE: "replace",
  REMOVE: "remove",
  REORDER: "reorder"
};

export default ({ dragger }, ctx, actions) => {
  const { isMovingOnHomeContainer, placedAtRaw, overlappedContainer } = ctx;
  const { index: rawIndex, dragger: placedDragger } = placedAtRaw;
  const placedAt = {
    index: undefined
  };

  if (!isMovingOnHomeContainer) {
    placedAt.index = rawIndex;
    placedAt.operation = operation["REPLACE"];
    actions.next();
    return;
  }

  // when `isMovingOnHomeContainer` is true, the relative position of dragger and dropped place
  // will matter on final `placedAt.index`

  const { dimension, id } = dragger;

  // dragger is moving overlapped on itself
  if (id === placedDragger.id) {
  } else {
    const { orientation } = overlappedContainer;
    const axis = orientationToAxis[orientation];
    const [minProperty] = axisMeasure[axis];
    const moveAfter =
      dragger.dimension[minProperty] < placedDragger.dimension[minProperty];
  }
};
