import Sabar from "sabar";
import { bindEvents } from "../../utils/event/bindEvents";
import Container from "./Container";
import Dragger from "./Dragger";
import { isElement } from "./dom";
import { findClosestContainer, findClosestDraggerFromEvent } from "./find";
import defaultConfig from "./defaultConfig";
import { setContainerAttributes, setDraggerAttributes } from "./setAttributes";
import mutationHandler from "./mutationHandler";

import getDimensions from "./middleware/onStart/getDimensions";
import validateContainers from "./middleware/onStart/validateContainers";
import attemptToCreateClone from "./middleware/onStart/attemptToCreateClone";

import shouldAcceptDragger from "./middleware/onMove/shouldAcceptDragger";
import syncCopyPosition from "./middleware/onMove/syncCopyPosition";
import resolveOverlappingContainer from "./middleware/shared/resolveOverlappedContainer";

class DND {
  constructor({ configs = [], rootElement }) {
    this.containers = {};
    this.draggers = {};
    this.extra = {};

    this.configs = configs.map(config => ({
      ...defaultConfig,
      ...config
    }));
    this.rootElement = rootElement;

    this.startObserve();
    this.setUp();
    this.startListen();

    this.onStartHandler = new Sabar({
      ctx: {
        containers: this.containers,
        draggers: this.draggers,
        extra: this.extra
      }
    });
    this.onMoveHandler = new Sabar({
      ctx: {
        containers: this.containers,
        draggers: this.draggers
      }
    });

    this.onStartHandler.use(
      getDimensions,
      validateContainers,
      attemptToCreateClone
    );
    this.onMoveHandler.use(
      syncCopyPosition,
      resolveOverlappingContainer,
      shouldAcceptDragger
    );
  }

  startListen() {
    bindEvents(window, {
      eventName: "mousedown",
      fn: e => {
        const dragger = findClosestDraggerFromEvent(e);
        if (dragger === -1) return;

        this.onStartHandler.start({ dragger });
        const { clone } = this.extra;

        // If dragger exists, then start to bind relative listener
        const unbind = bindEvents(window, [
          {
            // target should be moved by mousemove event.
            eventName: "mousemove",
            fn: event => {
              this.onMoveHandler.start({ event, dragger, clone });
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
   * extract `containerSelectors` and onStartHandler `container` and `dragger`
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

      elements.forEach(el =>
        this.handleContainerElement(el, config, this.configs)
      );
    });
  }

  handleContainerElement(el, config, dndConfig) {
    const container = new Container({
      el,
      containers: this.containers,
      dndConfig
    });
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
