import { RefObject } from 'react';
import { ContentBlockNode, GetEditor } from '.';

export interface HooksProps {
  nodeRef: RefObject<HTMLDivElement>;
  props: HooksComponentProps;
}

export interface HooksComponentProps {
  blockProps: {
    getEditor: GetEditor;
    resizeLayout: {
      width: string;
    };
  };
  block: ContentBlockNode;
}
