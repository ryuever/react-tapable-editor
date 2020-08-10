import { matchesDragger, matchesContainer, isElement } from './dom';
import DND from './index';
import reporter from './reporter';

const DEBUG = false;

export default (ctx: DND) => (mutationList: MutationRecord[]) => {
  const { containers } = ctx;
  const { configs } = ctx;

  for (const mutation of mutationList) {
    const { addedNodes, removedNodes } = mutation;
    if (addedNodes.length) {
      let merged = [] as Node[];

      addedNodes.forEach(node => {
        if (node && isElement(node)) {
          try {
            merged.push(node);
            // If dom is wrapped with a new div container, Only the new parent
            // div will be remarked.
            // https://stackoverflow.com/questions/8321874/how-to-get-all-childnodes-in-js-including-all-the-grandchildren
            const elements = (node as any).getElementsByTagName('div');
            merged = [...merged, ...elements];
          } catch (err) {
            console.log('err ', err);
          }
        }
      });

      merged.forEach(node => {
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
