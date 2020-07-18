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

export type ImageToolbarProps = {
  forwardRef: RefObject<HTMLDivElement>;
} & {
  getEditor: GetEditor;
};
