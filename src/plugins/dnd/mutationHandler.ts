import { matchesDragger, matchesContainer } from './dom';
import reporter from './reporter';

const DEBUG = false;

export default ctx => mutationList => {
  const { containers } = ctx;
  const { configs } = ctx;

  for (const mutation of mutationList) {
    const { addedNodes, removedNodes } = mutation;

    if (addedNodes.length) {
      addedNodes.forEach(node => {
        const matchedContainer = matchesContainer(node, configs);
        if (matchedContainer !== -1) {
          ctx.handleContainerElement(node, matchedContainer);
          // In case, dragger is batch updated by container..
          ctx.handleDraggers(node);
          DEBUG && reporter.addContainerNode(node);
        }

        // A container could be a dragger
        const matchedDragger = matchesDragger(node, configs);
        if (matchedDragger !== -1) {
          ctx.handleDraggerElement(node);
          DEBUG && reporter.addDraggerNode(node);
        }
      });
    }

    if (removedNodes.length) {
      removedNodes.forEach(node => {
        const matchedContainer = matchesContainer(node, configs);

        if (matchedContainer !== -1) {
          const containerId = node.getAttribute('data-container-id');
          const container = containers[containerId];
          DEBUG && reporter.removeContainerNode(node);
          if (container) container.cleanup();
        }
      });
    }
  }
};
