import { ContentBlockNode } from '.';
import { Map } from 'immutable';

export enum Position {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export enum Direction {
  Row = 'row',
  Column = 'column',
}

export interface TransformBlockCallback {
  (block: ContentBlockNode): ContentBlockNode;
}

// export interface WrapperProps {
//   flexRow: boolean;
//   'data-wrapper': boolean;
//   'data-direction': Direction;
// }

export type WrapperProps = Map<
  'flexRow' | 'data-wrapper' | 'data-direction' | undefined,
  boolean | Direction | undefined
>;

// addEventListener<K extends keyof WindowEventMap>
// (type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// export interface Binding <K extends keyof WindowEventMap>{
//   eventName: K;
//   fn: (this: Window, ev: WindowEventMap[K]) => any;
//   options?: boolean | AddEventListenerOptions
// }
export interface Binding {
  eventName: string;
  fn: (e: MouseEvent) => any;
  options?: AddEventListenerOptions;
}
