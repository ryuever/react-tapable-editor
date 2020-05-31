import { bindEvents } from "../../utils/event/bindEvents";
import { containerKeyExtractor } from "./key";
import Container from "./Container";
import Dragger from "./Dragger";
import Sabar from "sabar";
import { isElement } from "./utils";
import { matchesDragger, findClosestContainer } from "./dom";

bindEvents(window, {
  eventName: "mousedown",
  fn: e => {
    console.log("mouse down");
  }
});

class DND {
  constructor({ dndConfigs, rootElement }) {
    this.containers = [];
    this.handleContainers();
    this.dndConfigs = dndConfigs;
    this.rootElement = rootElement;

    this.startObserve();
    this.setUp();
  }

  startObserve() {
    let rootElement = this.rootElement;

    if (!isElement(rootElement)) {
      const el = document.querySelector(this.rootElement);
      if (el) rootElement = el;
    }

    const callback = mutationList => {
      for (let mutation of mutationList) {
        const { addedNodes, removedNodes } = mutation;

        if (addedNodes.length) {
          console.log("A child node has been added.", addedNodes);

          addedNodes.forEach(node => {
            const matched = matchesDragger(node, this.dndConfigs);
            if (matched === -1) return;
            this.handleDraggerElement(node);
          });
        }

        if (removedNodes.length) {
          console.log("A child node has been removed.", removedNodes);
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(rootElement, {
      childList: true,
      subtree: true
    });
  }

  /**
   * extract `containerSelectors` and prepare `container` and `dragger`
   */
  setUp() {
    this.containerSelectors = this.dndConfigs.map(config => {
      const { containerSelector } = config;
      return containerSelector;
    });

    this.containerSelectors.forEach(containerSelector =>
      this.handleContainers(containerSelector)
    );

    this.dndConfigs.forEach(config => {
      const { draggerSelector } = config;
      this.handleDraggerSelector(draggerSelector);
    });
  }

  handleContainers(containerSelector) {
    const elements = document.querySelectorAll(containerSelector);
    if (!elements) return;

    elements.forEach(el => {
      const container = new Container({ el });
      const id = container.id;
      this.containers[id] = container;
      el.setAttribute("data-is-container", "true");
      el.setAttribute("data-container-id", id);
    });
  }

  handleDraggerSelector(draggerSelector) {
    const elements = document.querySelectorAll(draggerSelector);
    if (!elements) return;
    elements.forEach(el => this.handleDraggerElement(el));
  }

  /**
   *
   * @param {HTMLElement} el
   * 1. Find closest container node first.
   * 2. Update container's children
   * 3. set dragger element's attributes.
   *
   */
  handleDraggerElement(el) {
    const container = findClosestContainer(this.containers, el);

    if (container === -1) return;
    const dragger = new Dragger({ el, container });
    container.addDirectChild(dragger);
    el.setAttribute("data-is-dragger", "true");
    el.setAttribute("data-dragger-id", dragger.id);
    el.setAttribute("data-container-context", container.id);
  }
}

export default DND;
