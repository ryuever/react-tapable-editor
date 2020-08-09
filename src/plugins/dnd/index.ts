import Sabar from 'sabar';
import { SyncHook } from 'tapable';
import Container from './Container';
import Dragger from './Dragger';
import { isElement } from './dom';
import { findClosestContainer } from './find';
import resolveDndConfig from './configs/resolveDndConfig';
import resolveConfig from './configs/resolveConfig';
import { setContainerAttributes, setDraggerAttributes } from './setAttributes';
import mutationHandler from './mutationHandler';

import getDimensions from './middleware/onStart/getDimensions';
import getDimensionsNested from './middleware/onStart/getDimensionsNested';
import validateContainers from './middleware/onStart/validateContainers';
import attemptToCreateClone from './middleware/onStart/attemptToCreateClone';

import syncCopyPosition from './middleware/onMove/syncCopyPosition';
import addIntermediateCtxValue from './middleware/onMove/addIntermediateCtxValue';
import removeIntermediateCtxValue from './middleware/onMove/removeIntermediateCtxValue';
import handleLeaveContainer from './middleware/onMove/effects/handleLeaveContainer';
import handleLeaveHomeContainer from './middleware/onMove/effects/handleLeaveHomeContainer';
import handleLeaveOtherContainer from './middleware/onMove/effects/handleLeaveOtherContainer';
import handleEnterContainer from './middleware/onMove/effects/handleEnterContainer';
import handleEnterHomeContainer from './middleware/onMove/effects/handleEnterHomeContainer';
import handleEnterOtherContainer from './middleware/onMove/effects/handleEnterOtherContainer';
import handleReorder from './middleware/onMove/effects/handleReorder';
import handleReorderOnHomeContainer from './middleware/onMove/effects/handleReorderOnHomeContainer';
import handleReorderOnOtherContainer from './middleware/onMove/effects/handleReorderOnOtherContainer';
import handleImpactDraggerEffect from './middleware/onMove/effects/handleImpactDraggerEffect';
import handleImpactContainerEffect from './middleware/onMove/effects/handleImpactContainerEffect';

import getImpactRawInfo from './middleware/shared/getImpactRawInfo';
import closest from './closest';

import MouseSensor from './sensors/mouse';
import DndEffects from './middleware/onMove/effects/DndEffects';
import {
  Config,
  ContainersMap,
  DraggersMap,
  DndHooks,
  Impact,
  Extra,
  GlobalConfig,
  ResultDNDConfig,
  ResultConfig,
} from '../../types';

class DND {
  public onStartHandler: Sabar;
  public onMoveHandler: Sabar;
  public containers: ContainersMap;
  public draggers: DraggersMap;
  public dndEffects: DndEffects;
  public extra: Extra;
  public hooks: DndHooks;
  public rootElement: HTMLElement | string;
  public impact: Impact;
  public configs: ResultConfig[];
  public dndConfig: ResultDNDConfig;
  public sensor: MouseSensor | null;

  constructor({
    configs = [] as Config[],
    rootElement,
    ...rest
  }: GlobalConfig) {
    this.containers = {};
    this.draggers = {};
    this.extra = {};

    this.dndEffects = new DndEffects();

    this.configs = resolveConfig(configs, rest);

    // global config to control all of the containers...
    this.dndConfig = resolveDndConfig(rest);

    this.hooks = {
      syncEffects: new SyncHook(['values']),
      cleanupEffects: new SyncHook(),
    };
    this.rootElement = rootElement;
    this.impact = {} as any;
    this.sensor = null;

    this.startObserve();
    this.setUp();

    this.onStartHandler = new Sabar({
      ctx: {
        containers: this.containers,
        draggers: this.draggers,
        vDraggers: this.draggers,
        vContainers: this.containers,
        extra: this.extra,
        hooks: this.hooks,
        dndConfig: this.dndConfig,
        // containersEffects: this.containersEffects,
        prevImpact: {},
        dndEffects: new DndEffects(),
      },
    });

    this.onMoveHandler = new Sabar({
      ctx: {
        containers: this.containers,
        draggers: this.draggers,
        vDraggers: this.draggers,
        vContainers: this.containers,
        // effects: this.effects,
        hooks: this.hooks,
        dndConfig: this.dndConfig,
        // containersEffects: this.containersEffects,
        dndEffects: this.dndEffects,
        prevImpact: {},
      },
    });

    this.onStartHandler.use(
      getDimensions,
      getDimensionsNested,
      validateContainers,
      // resolveRawPlacedInfo,
      attemptToCreateClone
    );
    this.onMoveHandler.use(
      syncCopyPosition,
      getImpactRawInfo,
      addIntermediateCtxValue,
      handleLeaveContainer,
      handleLeaveHomeContainer,
      handleLeaveOtherContainer,
      handleEnterContainer,
      handleEnterHomeContainer,
      handleEnterOtherContainer,
      handleReorder,
      handleReorderOnHomeContainer,
      handleReorderOnOtherContainer,
      handleImpactDraggerEffect,
      handleImpactContainerEffect,
      removeIntermediateCtxValue,
      () => {}
    );

    this.initSensor();
  }

  moveAPI = () => {
    return {
      hooks: this.hooks,
      prevImpact: this.impact,
    };
  };

  updateImpact = (impact: Impact) => {
    this.impact = impact;
  };

  getClone = (): HTMLElement | undefined => {
    return this.extra.clone;
  };

  initSensor() {
    this.sensor = new MouseSensor({
      moveAPI: this.moveAPI,
      getClone: this.getClone,
      onStartHandler: this.onStartHandler,
      onMoveHandler: this.onMoveHandler,
      getDragger: this.getDragger,
      configs: this.configs,
      dndEffects: this.dndEffects,
      updateImpact: this.updateImpact,
      dndConfig: this.dndConfig,
    });
    this.sensor.start();
  }

  public getDragger = (draggerId: string): Dragger => {
    return this.draggers[draggerId];
  };

  public getContainer = (containerId: string): Container => {
    return this.containers[containerId];
  };

  startObserve() {
    let { rootElement } = this;

    if (!isElement(rootElement)) {
      const el = document.querySelector(this.rootElement as string);
      if (el) rootElement = el as HTMLElement;
    }

    const observer = new MutationObserver(mutationHandler(this));

    observer.observe(rootElement as HTMLElement, {
      childList: true,
      subtree: true,
      // attributes: true,
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
    this.configs.forEach(config => {
      const { containerSelector } = config;
      const elements = node.querySelectorAll(containerSelector);
      if (!elements) return;

      elements.forEach(el =>
        this.handleContainerElement(el as HTMLElement, config)
      );
    });
  }

  handleContainerElement(el: HTMLElement, config: ResultConfig) {
    const keys = Object.keys(this.containers);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const containerInstance = this.containers[key];
      if (containerInstance.el === el) return;
    }

    const container = new Container({
      el,
      containers: this.containers,
      containerConfig: config,
      dndConfig: this.dndConfig,
    });
    const parentContainerNode = closest(el, '[data-is-container="true"]');
    if (parentContainerNode) {
      const containerId = parentContainerNode.getAttribute('data-container-id');
      if (containerId) {
        const parentContainer = this.containers[containerId];
        container.parentContainer = parentContainer;
      }
    }
    setContainerAttributes(container, config);
  }

  handleDraggers(containerNode: HTMLElement | Document = document) {
    this.configs.forEach(config => {
      const { draggerSelector } = config;
      this.handleDraggerInContainer(containerNode, draggerSelector);
    });
  }

  handleDraggerInContainer(
    containerNode: HTMLElement | Document,
    draggerSelector: string
  ) {
    const elements = containerNode.querySelectorAll(draggerSelector);
    if (!elements) return;
    elements.forEach(el => this.handleDraggerElement(el as HTMLElement));
  }

  /**
   *
   * @param {HTMLElement} el
   * 1. Find closest container node first.
   * 2. Update container's children
   * 3. set dragger element's attributes.
   *
   */
  handleDraggerElement(el: HTMLElement) {
    const container = findClosestContainer(this.containers, el, true);
    if (container === -1) return;

    // Maybe it's not required on initial...
    const keys = Object.keys(this.draggers);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const draggerInstance = this.draggers[key];
      if (draggerInstance.el === el) return;
    }

    const dragger = new Dragger({ el, container });
    container.addDirectChild(dragger);
    const draggerId = dragger.id;
    this.draggers[draggerId] = dragger;
    setDraggerAttributes(container, dragger);
  }
}

export default DND;
