import { SyncHook } from 'tapable';
import Container from '../plugins/dnd/Container';
import { default as IDragger } from '../plugins/dnd/Dragger';
import { Position } from './util';
import DndEffects from 'plugins/dnd/middleware/onMove/effects/DndEffects';
import EffectsManager from 'plugins/dnd/middleware/onMove/effects/EffectsManager';
import { RectObject } from './';

export enum Orientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export enum Mode {
  Fluid = 'fluid',
  Snap = 'snap',
  Nested = 'nested',
}

export type Dragger = IDragger;

export interface Config {
  orientation?: Orientation;
  draggerHandlerSelector?: string;
  containerSelector?: string;
  draggerSelector?: string;
  shouldAcceptDragger?: { (e: HTMLElement): boolean };
  containerEffect?: { ({ el }: { el: HTMLElement }): void | Function };
  draggerEffect?: DraggerEffectHandler;
  impactDraggerEffect?: ImpactDraggerEffectHandler;

  /**
   * It's called when enter a container, handler should return with a function
   * to make effect cleanup...
   */
  impactContainerEffect?: ImpactContainerEffectHandler;
  [key: string]: any;
}

export type DNDConfig = Config & {
  mode?: Mode;
  collisionPadding?: number;
  withPlaceholder: boolean;
  onDrop: { (output: MoveHandlerOutput): void };
};

/**
 * orientation should be required.
 */
export type ResultDNDConfig = DNDConfig & {
  mode: Mode;
  collisionPadding: number;
};

export type DefaultConfig = {
  orientation: Orientation;
};
export type ResultConfig = Config &
  DefaultConfig & {
    containerSelector: string;
    draggerSelector: string;
  };

export type GlobalConfig = DNDConfig & {
  rootElement: string;
  configs: Config[];
};

export interface Containers {
  [key: string]: Container;
}
export interface ContainerDimension {
  rect: RectObject;
  subject: {
    isVisible: boolean;
  };
  within: (point: Point) => boolean;
}

export interface DraggerDimension {
  rect: RectObject;
  top?: number;
  left?: number;
  firstCollisionRect?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  secondCollisionRect?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface Sorter<T> {
  (a: T, b: T): number;
}

export interface AxisMeasure {
  x: ['left', 'right'];
  y: ['top', 'bottom'];
  [key: string]: ['top' | 'left', 'right' | 'bottom'];
}

export interface OrientationToAxis {
  vertical: string;
  horizontal: string;
  [key: string]: string;
}

export type LoggerComponent = Container | Dragger;

export interface Predicator {
  (...args: any): boolean;
}

export interface DraggersMap {
  [key: string]: Dragger;
}

export interface ContainersMap {
  [key: string]: Container;
}

export type Point = [number, number];

export type Triangle = [[number, number], [number, number], [number, number]];

export interface Effect {
  teardown: Function | null | void;
  vContainer: Container;
}

export interface DraggerEffect {
  teardown: Function | null | void;
  vDragger: Dragger;
}
export interface ContainerEffect {
  teardown: Function | null | void;
  vContainer: Container;
  key: string;
}

export interface ImpactDraggerEffect {
  teardown: Function | null | void;
  vDragger: Dragger;
  key: string;
}

export interface DndHooks {
  syncEffects: SyncHook;
  cleanupEffects: SyncHook;
}

export interface Impact {
  impactVContainer: Container | null;
  index: number | null;
}

export interface MoveAPI {
  (): {
    hooks: DndHooks;
    prevImpact: Impact;
  };
}

export interface GetClone {
  (): HTMLElement | undefined;
}

export interface MoveHandlerOutput {
  dragger: HTMLElement;
  candidateDragger: HTMLElement;
  placedPosition: Position;
}

export interface MoveHandlerResult {
  impact: Impact;
  output: MoveHandlerOutput;
}

export interface Extra {
  clone?: HTMLElement;
}

export interface VContainer {
  [key: string]: Container;
}

export interface VDragger {
  [key: string]: Dragger;
}

export enum OnMoveOperation {
  OnStart = 'onStart',
  OnEnter = 'onEnter',
  OnLeave = 'onLeave',
  ReOrder = 'reOrder',
}

export interface OnMoveAction {
  operation: OnMoveOperation;
  isHomeContainerFocused: boolean;
  effectsManager: null | EffectsManager;
}

export interface OnStartHandlerContext {
  vContainers: VContainer;
  vDraggers: VDragger;
  extra: Extra;
  dndConfig: GlobalConfig;
  targetContainer: Container;
  impact: {
    impactContainer: Container;
  };
  impactRawInfo: RawInfo;
}

export interface OnMoveHandleContext {
  vContainers: VContainer;
  vDraggers: VDragger;
  dndConfig: GlobalConfig;
  action: OnMoveAction;
  impactRawInfo: RawInfo;
  dndEffects: DndEffects;
  impact: {
    impactVContainer: Container | null;
    index: number | null;
  };
  output: {
    dragger: HTMLElement;
    candidateDragger: HTMLElement;
    container: HTMLElement;
    placedPosition: Position;
  };
}

export interface OnMoveArgs {
  impactPoint: Point;
  clone: HTMLElement;
  liftUpVDragger: Dragger;
  isHomeContainer: (container: Container) => boolean;
  prevImpact: Impact;
  liftUpVDraggerIndex: number;
  lifeUpDragger: Dragger;
}

export interface RawInfo {
  candidateVDragger: Dragger | null;
  candidateVDraggerIndex: number | null;
  impactPosition: Position | null;
  impactVContainer: Container | null;
}

export interface DraggerEffectHandler {
  ({
    el,
    shouldMove,
    downstream,
    placedPosition,
    dimension,
    isHighlight,
  }: {
    el: HTMLElement;
    shouldMove: boolean;
    downstream: boolean;
    placedPosition: string;
    dimension: RectObject;
    isHighlight: boolean;
  }): Function | undefined;
}

export interface ImpactDraggerEffectHandler {
  ({
    dragger,
    container,
    candidateDragger,
    shouldMove,
    downstream,
    placedPosition,
    dimension,
    isHighlight,
  }: {
    dragger: HTMLElement;
    container: HTMLElement;
    candidateDragger: HTMLElement;
    shouldMove: boolean;
    downstream: boolean;
    placedPosition: Position;
    dimension: RectObject;
    isHighlight: boolean;
  }): Function | undefined;
}

export interface ImpactContainerEffectHandler {
  ({
    container,
    isHighlight,
  }: {
    container: HTMLElement;
    isHighlight: boolean;
  }): Function | undefined;
}
