import {
  orientationToAxis,
  axisMeasure,
  isClamped,
  axisClientMeasure
} from "../../utils";
import { within, positionInRect } from "../../collision";

const findClampedIndex = (value, children, minKey, maxKey) => {
  const len = children.getSize();
  let oldValue = 0;

  for (let i = 0; i < len; i++) {
    const child = children.getItem(i);
    const rect = child.dimension.rect;
    const min = rect[minKey];
    const max = rect[maxKey];

    if (!isClamped(value, oldValue, min)) {
      oldValue = max;
      continue;
    }

    return i;
  }
  return len;
};

const getInfo = (point, children, containers, orientation) => {
  const len = children.getSize();
  const info = {};

  for (let i = 0; i < len; i++) {
    const child = children.getItem(i);
    const childNode = child.el;
    const { firstCollisionRect, rect, secondCollisionRect } = child.dimension;

    if (within(firstCollisionRect, point)) {
      info.index = i;
      info.dragger = child;
      info.isLast = false;
      break;
    }

    if (within(secondCollisionRect, point)) {
      continue;
    }

    if (within(rect, point)) {
      info.index = i;
      info.dragger = child;
      info.isLast = false;

      // TODO: There is a possible point is in the gap between draggers...
      // Then loop on child, find the clamped value....
      // self is a container, point should be placed between draggers
      if (childNode.matches('[data-is-container="true"]')) {
        const id = childNode.getAttribute("data-container-id");
        const container = containers[id];

        const {
          children,
          containerConfig: { orientation: currentOrientation }
        } = container;
        const xInfo = getInfo(point, children, containers, currentOrientation);

        if (!xInfo) {
          const axis = orientationToAxis[orientation];
          const [minKey, maxKey] = axisMeasure[axis];
          const clientValue = event[axisClientMeasure[axis]];
          const index = findClampedIndex(clientValue, children, minKey, maxKey);

          console.log("index ", clientValue, children, minKey, maxKey);

          info.childInfo = {
            index: index,
            dragger: children.getItem(index)
          };
        } else {
          info.childInfo = xInfo;
        }
        console.log("child node -----------", id, info);
      } else {
        // dragger is a container...
        // Attempt to get container beneath current element node.
        const containerNodes = childNode.querySelector(
          '[data-is-container="true"]'
        );
        console.log("container node ", containerNodes);

        // If there is no matched element, the value of `containerNodes` will be null
        if (!containerNodes) return;

        const containersLength = containerNodes.length;

        // If node does not has inner container(self inclusive)
        if (!containersLength) {
          const position = positionInRect(point, rect, orientation);
          info.position = position;
        } else {
          for (let index = 0; index < containersLength; index++) {
            containerNode = containerNodes[index];
            const containerId = containerNode.getAttribute("data-container-id");
            const container = containers[containerId];
            const {
              children,
              containerConfig: { orientation }
            } = container;

            if (container) {
              // If childInfo has value, it means we have go through the right
              // value `path`
              const childInfo = getInfo(
                point,
                children,
                containers,
                orientation
              );
              if (childInfo) break;
            }
          }
        }
      }
    }
  }

  return info;
};

export default ({ event }, ctx, actions) => {
  const { targetContainer, containers } = ctx;
  if (!targetContainer) {
    actions.next();
    return;
  }

  const {
    containerConfig: { orientation },
    children
  } = targetContainer;

  // First, check point is within `horizontal` collision padding rect.
  const point = [event.clientX, event.clientY];
  ctx.placedAtRaw = getInfo(point, children, containers, orientation);

  console.log("place at row ", ctx.placedAtRaw);

  actions.next();
};
