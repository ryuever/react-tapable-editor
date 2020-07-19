import { RefObject, ReactNode, Ref } from 'react';
import { DraftBlockRenderMap, DraftStyleMap, Editor } from 'draft-js';
import { GetEditor } from './';

export interface EditorPropsBefore {
  imageRef: RefObject<HTMLDivElement>;
  inlineRef: RefObject<HTMLDivElement>;
  sidebarRef: RefObject<HTMLDivElement>;
  blockRenderMap: DraftBlockRenderMap;
  customStyleMap: DraftStyleMap;
  children?: ReactNode;
  placeholder: string;
}

// ts-hint: interface extends interface...
export type EditorProps = {
  forwardRef: Ref<Editor>;
} & EditorPropsBefore & {
    getEditor: GetEditor;
  };

export type EditorRef = RefObject<Editor>;
