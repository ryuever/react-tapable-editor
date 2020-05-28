import { bindEvents } from "../../utils/event/bindEvents";
import { containerKeyExtractor, draggerKeyExtractor } from "./key";
import Container from "./Container";
import Dragger from "./Dragger";
import Sabar from "sabar";

bindEvents(window, {
  eventName: "mousedown",
  fn: e => {
    console.log("mouse down");
  }
});

class DND {
  constructor() {
    this.containers = [];
    this.handleContainers();
  }

  handleContainers() {
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
  }
}
