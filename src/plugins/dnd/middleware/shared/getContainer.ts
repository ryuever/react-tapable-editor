import { Config, OnStartHandlerContext } from '../../../../types';
import Dragger from '../../Dragger';
import { Action } from 'sabar';
import Container from 'plugins/dnd/Container';

const shouldAcceptDragger = (containerConfig: Config, dragger: Dragger) => {
  const { draggerSelector, shouldAcceptDragger } = containerConfig;
  const { el } = dragger;
  if (typeof shouldAcceptDragger === 'function') {
    return shouldAcceptDragger(el);
  }

  return el.matches(draggerSelector);
};

const pickClosestContainer = (pendingContainers: Container[]) => {
  const len = pendingContainers.length;
  if (len <= 1) return pendingContainers[0];
  const isVerified = Object.create(null) as {
    [key: string]: {
      used: boolean;
      container: Container;
    };
  };

  for (let i = 0; i < len; i++) {
    const container = pendingContainers[i];
    const containerId = container.id;
    if (typeof isVerified[containerId] !== 'undefined') {
      break;
    }

    isVerified[containerId] = {
      used: true,
      container,
    };

    let { parentContainer } = container;

    while (parentContainer) {
      const parentContainerId = parentContainer.id;
      if (typeof isVerified[parentContainerId] !== 'undefined') {
        parentContainer = null;
      } else {
        parentContainer = parentContainer.parentContainer;
      }
      isVerified[parentContainerId].used = false;
    }
  }

  const remaining = [];

  for (const [, value] of Object.entries(isVerified)) {
    if (value.used) remaining.push(value.container);
  }

  return remaining[0];
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
 */
const getContainer = (
  {
    event,
    dragger,
  }: {
    event: MouseEvent;
    dragger: Dragger;
  },
  ctx: object,
  actions: Action
) => {
  const context = ctx as OnStartHandlerContext;
  const { clientX, clientY } = event;
  const { vContainers, dndConfig } = context;
  const { mode } = dndConfig;
  const keys = Object.keys(vContainers);
  const len = keys.length;
  const pendingContainers = [];

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const container = vContainers[key];
    const {
      dimension: { within },
      containerConfig,
    } = container;
    // ts-hint: https://stackoverflow.com/questions/54838593/type-number-is-missing-the-following-properties-from-type-number-number
    const point: [number, number] = [clientX, clientY];
    if (within(point) && shouldAcceptDragger(containerConfig, dragger)) {
      pendingContainers.push(container);
    }
  }

  let nextContainer = pendingContainers;

  // in `nested` mode, `horizontal` container is not considered
  if (mode === 'nested') {
    nextContainer = pendingContainers.filter(container => {
      const { orientation } = container.containerConfig;
      return orientation === 'vertical';
    });
  }

  context.targetContainer = pickClosestContainer(nextContainer);
  context.impact.impactContainer = context.targetContainer;
  actions.next();
};

export default getContainer;
