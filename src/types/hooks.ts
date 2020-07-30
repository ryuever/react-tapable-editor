import { RefObject } from 'react';
import { ContentBlockNode, GetEditor } from '.';
import { ContentNodeState } from './draft-js';

export interface HooksProps {
  nodeRef: RefObject<HTMLDivElement>;
  props: HooksComponentProps;
}

export interface ResizeLayout {
  width: string;
}

export interface BlockProps {
  getEditor: GetEditor;
  resizeLayout: ResizeLayout;
  alignment: string;
}

export interface HooksComponentProps {
  blockProps: BlockProps;
  block: ContentBlockNode;
  contentState: ContentNodeState;
}
