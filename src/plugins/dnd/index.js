import Sabar from "sabar";
import { bindEvents } from "../../utils/event/bindEvents";
import Container from "./Container";
import Dragger from "./Dragger";
import {
  findClosestContainer,
  isElement,
  findClosestDraggerFromEvent
} from "./dom";
import defaultConfig from "./defaultConfig";
import { setContainerAttributes, setDraggerAttributes } from "./setAttributes";
import mutationHandler from "./mutationHandler";
import getDimensions from "./middleware/getDimensions";
import validateContainerRelation from "./middleware/validateContainerRelation";

class DND {
  constructor({ configs = [], rootElement }) {
    this.containers = {};
    this.draggers = {};

    this.configs = configs.map(config => ({
      ...defaultConfig,
      ...config
    }));
    this.rootElement = rootElement;

    this.startObserve();
    this.setUp();
    this.startListen();

    this.prepare = new Sabar({
      ctx: {
        containers: this.containers,
        draggers: this.draggers
      }
    });

    this.prepare.use(getDimensions, validateContainerRelation);
  }

  startListen() {
    bindEvents(window, {
      eventName: "mousedown",
      fn: e => {
        const dragger = findClosestDraggerFromEvent(e);
        if (dragger === -1) return;
        const clone = dragger.cloneNode(true);
        document.body.appendChild(clone);

        this.prepare.start({});

        // If dragger exists, then start to bind relative listener
        const unbind = bindEvents(window, [
          {
            // target should be moved by mousemove event.
            eventName: "mousemove",
            fn: e => {
              const { clientY, clientX } = e;
              clone.style.position = "fixed";
              clone.style.top = `${clientY}px`;
              clone.style.left = `${clientX}px`;
            }
          },
          {
            eventName: "mouseup",
            fn: e => {
              unbind();
              document.body.removeChild(clone);
            }
          }
        ]);
      }
    });
  }

  startObserve() {
    let rootElement = this.rootElement;

    if (!isElement(rootElement)) {
      const el = document.querySelector(this.rootElement);
      if (el) rootElement = el;
    }

    const observer = new MutationObserver(mutationHandler(this));

    observer.observe(rootElement, {
      childList: true,
      subtree: true
    });
  }

  /**
   * extract `containerSelectors` and prepare `container` and `dragger`
   */
  setUp() {
    this.handleContainers();
    this.handleDraggers();
  }

  handleContainers(node = document) {
    this.configs.map(config => {
      const { containerSelector } = config;
      const elements = node.querySelectorAll(containerSelector);
      if (!elements) return;

      elements.forEach(el => this.handleContainerElement(el, config));
    });
  }

  handleContainerElement(el, config) {
    const container = new Container({ el, containers: this.containers });
    setContainerAttributes(container, config);
  }

  handleDraggers(containerNode = document) {
    this.configs.forEach(config => {
      const { draggerSelector } = config;
      this.handleDraggerInContainer(containerNode, draggerSelector);
    });
  }

  handleDraggerInContainer(containerNode, draggerSelector) {
    const elements = containerNode.querySelectorAll(draggerSelector);
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
    const draggerId = dragger.id;
    this.draggers[draggerId] = dragger;
    setDraggerAttributes(container, dragger);
  }
}

export default DND;
