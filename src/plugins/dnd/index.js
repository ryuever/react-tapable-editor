import Sabar from "sabar";
import Container from "./Container";
import Dragger from "./Dragger";
import { isElement } from "./dom";
import { findClosestContainer } from "./find";
import resolveConfig from "./resolveConfig";
import { setContainerAttributes, setDraggerAttributes } from "./setAttributes";
import mutationHandler from "./mutationHandler";

import getDimensions from "./middleware/onStart/getDimensions";
import validateContainers from "./middleware/onStart/validateContainers";
import attemptToCreateClone from "./middleware/onStart/attemptToCreateClone";

import syncCopyPosition from "./middleware/onMove/syncCopyPosition";
import movingOnHomeContainer from "./middleware/onMove/movingOnHomeContainer";
import resolvePlacedInfo from "./middleware/onMove/resolvePlacedInfo";
import updateEffects from "./middleware/onMove/updateEffects";

import resolveRawPlacedInfo from "./middleware/shared/resolveRawPlacedInfo";
import getDropTarget from "./middleware/shared/getContainer";
import { SyncHook } from "tapable";
import closest from "./closest";

import MouseSensor from "./sensors/mouse";

class DND {
  constructor({ configs = [], rootElement, ...rest }) {
    this.containers = {};
    this.draggers = {};
    this.extra = {};
    this.effects = {
      containers: [],
      draggers: [],
      containerEffects: [],
      draggerEffects: []
    };

    this.configs = resolveConfig(configs, rest);

    this.containerEffects = [];
    this.draggerEffects = [];

    this.hooks = {
      syncEffects: new SyncHook(["values"])
    };
    this.rootElement = rootElement;

    this.startObserve();
    this.setUp();

    this.onStartHandler = new Sabar({
      ctx: {
        containers: this.containers,
        draggers: this.draggers,
        extra: this.extra,
        hooks: this.hooks
      }
    });

    this.onMoveHandler = new Sabar({
      ctx: {
        containers: this.containers,
        draggers: this.draggers,
        effects: this.effects,
        hooks: this.hooks
      }
    });

    this.onStartHandler.use(
      getDimensions,
      validateContainers,
      resolveRawPlacedInfo,
      attemptToCreateClone
    );
    this.onMoveHandler.use(
      syncCopyPosition,
      getDropTarget,
      movingOnHomeContainer,
      resolveRawPlacedInfo,
      resolvePlacedInfo,
      updateEffects,
      (_, ctx) => {
        console.log("ctx ", ctx);
      }
    );

    this.hooks.syncEffects.tap("syncEffects", values => {
      this.effects = values.effects;
    });

    this.initSensor();
  }

  moveAPI = () => {
    return {
      prevEffects: this.effects
    };
  };

  getClone = () => {
    return this.extra.clone;
  };

  initSensor() {
    this.sensor = new MouseSensor({
      moveAPI: this.moveAPI,
      getClone: this.getClone,
      onStartHandler: this.onStartHandler,
      onMoveHandler: this.onMoveHandler,
      getDragger: this.getDragger,
      getContainer: this.getContainer,
      configs: this.configs
    });
    this.sensor.start();
  }

  getDragger = draggerId => {
    return this.draggers[draggerId];
  };

  getContainer = containerId => {
    return this.containers[containerId];
  };

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
      containerConfig: config,
      dndConfig
    });
    const parentContainerNode = closest(el, '[data-is-container="true"]');
    if (parentContainerNode) {
      const containerId = parentContainerNode.getAttribute("data-container-id");
      const parentContainer = this.containers[containerId];
      container.parentContainer = parentContainer;
    }
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
