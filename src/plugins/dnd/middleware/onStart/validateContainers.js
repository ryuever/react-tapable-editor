import { intersect, coincide, contains } from '../../collision';

/**
 * 1. Container should be enclosed by other container entirely.
 * 2. Container should be on the outer of other container.
 * 3. The intersection of containers is not allowed.
 */

export default (_, ctx, actions) => {
  const { containers } = ctx;

  const keys = Object.keys(containers);
  const len = keys.length;

  console.log('contaienr ', containers);

  for (let i = 0; i < len; i++) {
    const containerA = containers[keys[i]];
    for (let j = i + 1; j < len; j++) {
      const containerB = containers[keys[j]];
      const a = containerA.dimension.rect;
      const b = containerB.dimension.rect;

      // To ensure there are spaces between containers.
      if (intersect(a, b) && !coincide(a, b) && !contains(a, b)) {
        throw new Error(
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
