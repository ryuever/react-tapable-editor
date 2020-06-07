import { matchesDragger, matchesContainer } from "./dom";

const DEBUG = false;

export default ctx => mutationList => {
  const containers = ctx.containers;
  const configs = ctx.configs;

  for (let mutation of mutationList) {
    const { addedNodes, removedNodes } = mutation;

    if (addedNodes.length) {
      addedNodes.forEach(node => {
        const matchedContainer = matchesContainer(node, configs);
        if (matchedContainer !== -1) {
          ctx.handleContainerElement(node, matchedContainer);
          // In case, dragger is batch updated by container..
          ctx.handleDraggers(node);
          DEBUG && console.log("add container ", node);
        }

        // A container could be a dragger
        const matchedDragger = matchesDragger(node, configs);
        if (matchedDragger !== -1) {
          ctx.handleDraggerElement(node);
          DEBUG && console.log("add dragger ", node);
        }
      });
    }

    if (removedNodes.length) {
      removedNodes.forEach(node => {
        const matchedContainer = matchesContainer(node, configs);

        if (matchedContainer !== -1) {
          const containerId = node.getAttribute("data-container-id");
          const container = containers[containerId];
          DEBUG && console.log("remove container ", node);
          if (container) container.cleanup();
        }
      });
    }
  }
};
