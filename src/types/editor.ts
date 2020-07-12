import { RefObject } from 'react';

// import { ReactChild } from 'react'

export interface Props {
  getEditor: object;
  // forwardRef,
  // placeholder,
  // imageRef,
  // inlineRef,
  // sidebarRef,
  // blockRenderMap,
  // customStyleMap,
}

export type EditorRef = RefObject<HTMLDivElement>;
