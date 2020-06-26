import {
  getVDragger,
  draggerElementFromPoint,
  getVContainer,
  containerElementFromPoint,
  closestDraggerElementFromElement,
  closestExclusiveContainerNodeFromElement
} from "../../setAttributes";
import { within, positionInRect } from "../../collision";

const shouldAccept = (vContainer, vDragger) => {
  const { containerConfig } = vContainer;
  const el = vDragger.el;
  const { draggerSelector, shouldAcceptDragger } = containerConfig;
  if (typeof shouldAcceptDragger === "function") {
    return shouldAcceptDragger(el);
  }

  return el.matches(draggerSelector);
};

const getRawInfo = ({
  impactPoint,
  candidateContainerElement,
  vDraggers,
  vContainers,
  liftUpVDragger,
  isNested
}) => {
  // console.log('candidateContainerElement ', candidateContainerElement)
  const vContainer = getVContainer(candidateContainerElement, vContainers);
  const {
    containerConfig: { orientation },
    children
  } = vContainer;

  if (shouldAccept(vContainer, liftUpVDragger)) {
    for (let i = 0; i < children.getSize(); i++) {
      const vDragger = children.getItem(i);
      // `inNested` mode, horizontal container's sensitive areas is on two sides.
      if (isNested && orientation === "horizontal") {
        // console.log('vDragger.dimension ', vDragger.dimension, impactPoint)
        const { firstCollisionRect, secondCollisionRect } = vDragger.dimension;
        if (within(firstCollisionRect, impactPoint)) {
          console.log("hit before ", vContainer.id);
          return {
            candidateVDragger: vDragger,
            candidateVDraggerIndex: i,
            impactPosition: "left",
            impactVContainer: vContainer
          };
        }

        if (within(secondCollisionRect, impactPoint)) {
          console.log("hit after ", vContainer.id);
          return {
            candidateVDragger: vDragger,
            candidateVDraggerIndex: i,
            impactPosition: "right",
            impactVContainer: vContainer
          };
        }
      } else {
        const rect = vDragger.dimension.rect;
        if (within(rect, impactPoint)) {
          console.log("hit main ", vContainer.id);
          const position = positionInRect(impactPoint, rect);

          return {
            candidateVDragger: vDragger,
            candidateVDraggerIndex: i,
            impactPosition: position,
            impactVContainer: vContainer
          };
        }
      }
    }
  }

  const containerElement = vContainer.el;
  const nextCandidateContainerElement = closestExclusiveContainerNodeFromElement(
    containerElement
  );

  if (!nextCandidateContainerElement) return null;

  return getRawInfo({
    impactPoint,
    candidateContainerElement: nextCandidateContainerElement,
    vDraggers,
    vContainers,
    liftUpVDragger,
    isFirst: false,
    isNested
  });
};

/**
 *
 * @param {*} param0
 * @param {*} ctx
 * @param {*} actions
 *
 * Difference between `targetContainer` and `impactContainer`...
 * `impactContainer` is bound with `impactDragger`. There is a situation
 * point is in the gap between dragger and container...
 *
 * Why it's called `getImpactRawInfo` ? Because `impactContainer` may be
 * update when checking the side padding on `nested` mode.
 */
const getImpactRawInfo = ({ impactPoint, liftUpVDragger }, ctx, actions) => {
  const { vContainers, vDraggers, dndConfig } = ctx;
  const { isNested } = dndConfig;

  // Find the most inner container include point
  // const candidateDraggerElement = draggerElementFromPoint(impactPoint);
  // The reason why use container ? because point maybe placed on the gap between
  // `container` and `dragger`.
  const candidateContainerElement = containerElementFromPoint(impactPoint);

  let impactRawInfo = {
    candidateVDragger: null,
    impactVContainer: null,
    impactPosition: null,
    candidateVDraggerIndex: null
  };

  if (candidateContainerElement) {
    impactRawInfo = getRawInfo({
      impactPoint,
      candidateContainerElement,
      vDraggers,
      vContainers,
      liftUpVDragger,
      isFirst: true,
      isNested
    });
  }

  ctx.impactRawInfo = impactRawInfo;

  actions.next();
};

export default getImpactRawInfo;
