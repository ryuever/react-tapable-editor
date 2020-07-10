import {
  getVContainer,
  containerElementFromPoint,
  closestExclusiveContainerNodeFromElement,
} from '../../setAttributes';
import { within, pointInRectWithOrientation } from '../../collision';

const shouldAccept = (vContainer, vDragger) => {
  const { containerConfig } = vContainer;
  const { el } = vDragger;
  const { draggerSelector, shouldAcceptDragger } = containerConfig;
  if (typeof shouldAcceptDragger === 'function') {
    return shouldAcceptDragger(el);
  }

  return el.matches(draggerSelector);
};

const DEBUG = false;

const getRawInfo = ({
  impactPoint,
  candidateContainerElement,
  vDraggers,
  vContainers,
  liftUpVDragger,
  isNested,
}) => {
  // console.log('candidateContainerElement ', candidateContainerElement)
  const vContainer = getVContainer(candidateContainerElement, vContainers);

  // If dragger move on to itself or its children's node container.
  // then return...
  if (liftUpVDragger.el.contains(vContainer.el)) return;

  const {
    containerConfig: { orientation },
    children,
  } = vContainer;

  if (shouldAccept(vContainer, liftUpVDragger)) {
    for (let i = 0; i < children.getSize(); i++) {
      const vDragger = children.getItem(i);
      // `inNested` mode, horizontal container's sensitive areas is on two sides.
      if (isNested && orientation === 'horizontal') {
        // console.log('vDragger.dimension ', vDragger.dimension, impactPoint)
        const { firstCollisionRect, secondCollisionRect } = vDragger.dimension;
        if (within(firstCollisionRect, impactPoint)) {
          DEBUG && console.log('hit before ', vContainer.id);
          return {
            candidateVDragger: vDragger,
            candidateVDraggerIndex: i,
            impactPosition: 'left',
            impactVContainer: vContainer,
          };
        }

        if (within(secondCollisionRect, impactPoint)) {
          DEBUG && console.log('hit after ', vContainer.id);
          return {
            candidateVDragger: vDragger,
            candidateVDraggerIndex: i,
            impactPosition: 'right',
            impactVContainer: vContainer,
          };
        }
      } else {
        const { rect } = vDragger.dimension;
        if (within(rect, impactPoint)) {
          DEBUG && console.log('hit main ', vContainer.id);
          const position = pointInRectWithOrientation(
            impactPoint,
            rect,
            orientation
          );

          return {
            candidateVDragger: vDragger,
            candidateVDraggerIndex: i,
            impactPosition: position,
            impactVContainer: vContainer,
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
    isNested,
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
    candidateVDraggerIndex: null,
  };

  if (candidateContainerElement) {
    impactRawInfo =
      getRawInfo({
        impactPoint,
        candidateContainerElement,
        vDraggers,
        vContainers,
        liftUpVDragger,
        isFirst: true,
        isNested,
      }) || {};
  }

  // console.log('impact raw ', impactRawInfo)
  ctx.impactRawInfo = impactRawInfo;
  // console.log("impact raw ", ctx.impactRawInfo);

  actions.next();
};

export default getImpactRawInfo;
