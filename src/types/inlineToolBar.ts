import { Ref } from 'react';
import { GetEditor } from './';
import Immutable from 'immutable';
import { DraftBlockType } from 'draft-js';

// ts-hint: InlineToolbarProps should be split into two parts,
// or it will error in Editor.ts file
export type InlineToolbarProps = {
  forwardRef: Ref<HTMLDivElement>;
} & {
  getEditor: GetEditor;
};

export interface InlineToolbarStateValues {
  styles: Immutable.OrderedSet<any>;
  blockTypes: DraftBlockType[];
  hasLink: boolean;
  inDisplayMode: boolean;
}

export interface InputBarProps {
  getEditor: GetEditor;
}

export interface StyleControlsButtonProps {
  active: boolean;
  getEditor: GetEditor;
}

export interface LinkControlsProps {
  active: boolean;
  getEditor: GetEditor;
  handleClick: Function;
}

export interface StyleControlsProps {
  blockTypes: string[];
  styles: any;
  getEditor: GetEditor;
  toggleDisplayMode: Function;
  hasLink: boolean;
}
