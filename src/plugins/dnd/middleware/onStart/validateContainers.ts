import { intersect, coincide, contains, overlapOnEdge } from '../../collision';
import { Action } from 'sabar';
import { OnStartHandlerContext } from 'types';

/**
 * 1. Container should be enclosed by other container entirely.
 * 2. Container should be on the outer of other container.
 * 3. The intersection of containers is not allowed.
 */

export default (ctx: object, actions: Action) => {
  const context = ctx as OnStartHandlerContext;
  const { vContainers } = context;

  const keys = Object.keys(vContainers);
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const containerA = vContainers[keys[i]];
    for (let j = i + 1; j < len; j++) {
      const containerB = vContainers[keys[j]];
      const a = containerA.dimension.rect;
      const b = containerB.dimension.rect;

      // To ensure there are spaces between containers.
      if (
        intersect(a, b) &&
        !coincide(a, b) &&
        !contains(a, b) &&
        !overlapOnEdge(a, b)
      ) {
        console.warn(
          '=======================================\n' +
            'The interaction of containers is forbidden\n' +
            `  containerA's id: ${containerA.id}\n` +
            `  containerB's id: ${containerB.id}\n`
        );
      }
    }
  }

  actions.next();
};
