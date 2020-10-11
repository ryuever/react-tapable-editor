import {
  getVContainer,
  containerElementFromPoint,
  closestExclusiveContainerNodeFromElement,
} from '../../setAttributes';
import { within, pointInRectWithOrientation } from '../../collision';
import Container from '../../Container';
import Dragger from '../../Dragger';
import {
  Point,
  DraggersMap,
  RawInfo,
  ContainersMap,
  Position,
  OnStartHandlerContext,
  OnMoveArgs,
} from '../../../../types';
import { Action } from 'sabar';

const shouldAccept = (vContainer: Container, vDragger: Dragger) => {
  const { containerConfig } = vContainer;
  const { el } = vDragger;
  const { draggerSelector, shouldAcceptDragger } = containerConfig;
  if (typeof shouldAcceptDragger === 'function') {
    return shouldAcceptDragger(el);
  }

  return el.matches(draggerSelector);
};

const DEBUG = true;

const getRawInfo = ({
  impactPoint,
  candidateContainerElement,
  vDraggers,
  vContainers,
  liftUpVDragger,
  isNested,
}: {
  impactPoint: Point;
  candidateContainerElement: HTMLElement;
  vDraggers: DraggersMap;
  vContainers: ContainersMap;
  liftUpVDragger: Dragger;
  isNested: boolean;
}): RawInfo | null => {
  // console.log('candidateContainerElement ', candidateContainerElement)
  const vContainer = getVContainer(candidateContainerElement, vContainers);

  if (!vContainer) return null;

  // If dragger move on to itself or its children's node container.
  // then return...
  if (liftUpVDragger.el.contains(vContainer.el)) return null;

  const {
    containerConfig: { orientation },
    children,
  } = vContainer;

  console.log(
    'vcontainer ',
    vContainer,
    liftUpVDragger,
    shouldAccept(vContainer, liftUpVDragger)
  );

  if (shouldAccept(vContainer, liftUpVDragger)) {
    for (let i = 0; i < children.getSize(); i++) {
      const vDragger = children.getItem(i);
      // `inNested` mode, horizontal container's sensitive areas is on two sides.
      if (isNested && orientation === 'horizontal') {
        // console.log('vDragger.dimension ', vDragger.dimension, impactPoint)
        const { firstCollisionRect, secondCollisionRect } = vDragger.dimension;
        if (within(firstCollisionRect!, impactPoint)) {
          DEBUG && console.log('hit before ', vContainer.id);
          return {
            candidateVDragger: vDragger,
            candidateVDraggerIndex: i,
            impactPosition: Position.Left,
            impactVContainer: vContainer,
          };
        }

        if (within(secondCollisionRect!, impactPoint)) {
          DEBUG && console.log('hit after ', vContainer.id);
          return {
            candidateVDragger: vDragger,
            candidateVDraggerIndex: i,
            impactPosition: Position.Right,
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
            impactPosition: position as Position,
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
const getImpactRawInfo = (args: any, ctx: object, actions: Action) => {
  const { impactPoint, liftUpVDragger } = args as OnMoveArgs;
  const context = ctx as OnStartHandlerContext;
  const { vContainers, vDraggers, dndConfig } = context;
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
  } as RawInfo;

  console.log('candiate ', candidateContainerElement);

  if (candidateContainerElement) {
    const value = getRawInfo({
      impactPoint,
      candidateContainerElement,
      vDraggers,
      vContainers,
      liftUpVDragger,
      isNested,
    });
    if (value) impactRawInfo = value;

    console.log('value ', value);
  }

  context.impactRawInfo = impactRawInfo;

  actions.next();
};

export default getImpactRawInfo;
