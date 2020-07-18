import { RefObject } from 'react';
import { ContentBlockNode, GetEditor } from '.';

export interface HooksProps {
  nodeRef: RefObject<HTMLDivElement>;
  props: HooksComponentProps;
}

export interface ResizeLayout {
  width: string;
}

export interface HooksComponentProps {
  blockProps: {
    getEditor: GetEditor;
    resizeLayout: ResizeLayout;
  };
  block: ContentBlockNode;
}
