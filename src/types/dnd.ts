import { SyncHook } from 'tapable';
import Container from '../plugins/dnd/Container';
import Dragger from '../plugins/dnd/Dragger';
import { Position } from './util';

export enum Orientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export enum Mode {
  Fluid = 'fluid',
  Snap = 'snap',
  Nested = 'nested',
}

export interface Config {
  orientation: Orientation;
  draggerHandlerSelector: string;
  containerSelector: string;
  draggerSelector: string;
  shouldAcceptDragger: { (e: HTMLElement): boolean };
  containerEffect: { (): void | Function };
  draggerEffect: { (): void | Function };
  impactDraggerEffect: { (): void | Function };
  [key: string]: any;
}

export type GlobalConfig = Partial<Config> & {
  mode: Mode;
  collisionPadding: number;
  withPlaceholder: boolean;
  isNest: boolean;
  onDrop: { (output: MoveHandlerOutput): {} };
  [key: string]: any;
};

export interface Containers {
  [key: string]: Container;
}

export interface RectObject {
  top: number;
  right: number;
  bottom: number;
  left: number;
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
}

export interface Sorter<T> {
  (a: T, b: T): number;
}

export interface AxisMeasure {
  y: string[];
  x: string[];
  [key: string]: string[];
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
  teardown: () => {};
}

export interface Hooks {
  syncEffects: SyncHook;
  cleanupEffects: SyncHook;
}

export interface Impact {}

export interface MoveAPI {
  (): {
    hooks: Hooks;
    prevImpact: Impact;
  };
}

export interface GetClone {
  (): HTMLElement | null;
}

export interface MoveHandlerOutput {}

export interface MoveHandlerResult {
  impact: Impact;
  output: MoveHandlerOutput;
}

export interface Extra {
  clone: HTMLElement;
}

export interface VContainer {
  [key: string]: Container;
}

export interface VDragger {
  [key: string]: Dragger;
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
  action: object;
}

export interface RawInfo {
  candidateVDragger: Dragger | null;
  candidateVDraggerIndex: number | null;
  impactPosition: Position | null;
  impactVContainer: Container | null;
}
