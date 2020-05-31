import { bindEvents } from "../../utils/event/bindEvents";
import { containerKeyExtractor, draggerKeyExtractor } from "./key";
import Container from "./Container";
import closest from "./closest";
import Dragger from "./Dragger";
import Sabar from "sabar";

bindEvents(window, {
  eventName: "mousedown",
  fn: e => {
    console.log("mouse down");
  }
});

class DND {
  constructor(dndConfigs) {
    this.containers = [];
    this.handleContainers();
    this.dndConfigs = dndConfigs;

    this.setUp();
  }

  /**
   * extract `containerClasses` and prepare `container` and `dragger`
   */
  setUp() {
    this.containerClasses = this.dndConfigs.map(config => {
      const { containerClass } = config;
      return this.containerClasses;
    });

    this.containerClasses.forEach(containerClass =>
      this.handleContainers(containerClass)
    );

    this.dndConfigs.forEach(config => {
      const { containerClass, draggerClass } = config;
      this.handleChildren(draggerClass);
    });
  }

  handleContainers(containerClass) {
    const containers = document.querySelector(`.${containerClass}`);

    containers.forEach((container, index) => {
      const key = containerKeyExtractor(index);
      this.containers[key] = new Container();
      container.setAttribute("data-is-container", "true");
      container.setAttribute("data-container-id", key);
    });
  }

  handleChildren(draggerClass) {
    const elements = document.querySelector(`.${draggerClass}`);
    elements.forEach(el => {
      const directParent = closest(el, '[data-is-container="true"]');
      const index = this.containers.find(
        container => container.el === directParent
      );
      let container;
      if (index !== -1) container = this.containers[index];
      const dragger = new Dragger({ el, container });
      dragger.teardown = container.addDirectChild(dragger);
      dragger.container = container;
      el.setAttribute("data-is-dragger", "true");
      el.setAttribute("data-dragger-id", dragger.id);
      el.setAttribute("data-container-context", container.id);
    });
  }
}
