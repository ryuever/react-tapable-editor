import { RefObject } from 'react';
import { GetEditor } from './plugin';

export interface ImageAlignmentButtonFC {
  activeKey: string;
  clickHandler: Function;
  active: boolean;
}

export enum Alignment {
  Center = 'center',
  Right = 'right',
  Left = 'left',
  LeftFill = 'leftFill',
  RightFill = 'rightFill',
}

// ts-hint: ImageToolbarProps should be split into two parts,
// or it will error in Editor.ts file
export type ImageToolbarProps = {
  forwardRef: RefObject<HTMLDivElement>;
} & {
  getEditor: GetEditor;
};
