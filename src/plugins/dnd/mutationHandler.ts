import { matchesDragger, matchesContainer } from './dom';
import DND from './index';
import reporter from './reporter';

const DEBUG = false;

export default (ctx: DND) => (mutationList: MutationRecord[]) => {
  const { containers } = ctx;
  const { configs } = ctx;

  for (const mutation of mutationList) {
    const { addedNodes, removedNodes } = mutation;

    if (addedNodes.length) {
      addedNodes.forEach(node => {
        const containerConfig = matchesContainer(node, configs);
        if (containerConfig !== -1) {
          ctx.handleContainerElement(node as HTMLElement, containerConfig);
          // In case, dragger is batch updated by container..
          ctx.handleDraggers(node as HTMLElement);
          DEBUG && reporter.addContainerNode(node);
        }

        // A container could be a dragger
        const matchedDragger = matchesDragger(node, configs);
        if (matchedDragger !== -1) {
          ctx.handleDraggerElement(node as HTMLElement);
          DEBUG && reporter.addDraggerNode(node);
        }
      });
    }

    if (removedNodes.length) {
      removedNodes.forEach(node => {
        const matchedContainer = matchesContainer(node, configs);

        if (matchedContainer !== -1) {
          const containerId = (node as HTMLElement).getAttribute(
            'data-container-id'
          );
          if (!containerId) return;
          const container = containers[containerId];
          DEBUG && reporter.removeContainerNode(node);
          if (container) container.cleanup();
        }
      });
    }
  }
};
