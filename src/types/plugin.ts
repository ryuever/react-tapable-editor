import { RefObject } from 'react';
import { SyncHook, SyncWaterfallHook, SyncBailHook } from 'tapable';
import { EditorState } from 'draft-js';

export interface Hooks {
  setState: SyncHook;
  onChange: SyncWaterfallHook;
  stateFilter: SyncBailHook;
  toggleWaterfallBlockType: SyncWaterfallHook;
  toggleBlockType: SyncHook;
  toggleInlineStyleV2: SyncHook;
  toggleInlineStyle: SyncHook;
  afterInlineStyleApplied: SyncHook;
  createBlockRenderMap: SyncBailHook;
  createCustomStyleMap: SyncBailHook;
  blockStyleFn: SyncBailHook;
  handleKeyCommand: SyncBailHook;
  handleDroppedFiles: SyncHook;
  addImage: SyncHook;
  blockRendererFn: SyncBailHook;
  createPlaceholder: SyncHook;
  didUpdate: SyncHook;
  updatePlaceholder: SyncHook;
  compositeDecorator: SyncWaterfallHook;
  keyBindingFn: SyncBailHook;
  syncSelectionChange: SyncHook;
  selectionInitChange: SyncHook;
  selectionCollapsedChange: SyncHook;
  selectionFocusChange: SyncHook;
  selectionMoveInnerBlock: SyncHook;
  selectionMoveOuterBlock: SyncHook;
  selectionRangeChange: SyncHook;
  selectionRangeSizeChange: SyncHook;
  selectionRangeContentChange: SyncHook;
  inlineBarChange: SyncHook;
  hideInlineToolbar: SyncHook;
  afterClickLinkButton: SyncHook;
  cleanUpLinkClickState: SyncHook;
  toggleImageToolbarVisible: SyncHook;
  updateDecorator: SyncWaterfallHook;
  updateDragSubscription: SyncHook;
  syncBlockKeys: SyncHook;
  prepareDragStart: SyncHook;
  teardownDragDrop: SyncHook;
  afterMounted: SyncHook;
}

export interface PluginState {
  editorState: EditorState;
}

export interface PluginEditorProps {
  plugins: [];
}

export interface PluginEditorState {
  editorState: EditorState;
}

export interface GetEditor {
  (): {
    hooks: Hooks;
    editorState: EditorState;
    editorRef: RefObject<HTMLDivElement>;
    inlineToolbarRef: RefObject<HTMLDivElement>;
    imageToolbarRef: RefObject<HTMLDivElement>;
    sidebarRef: RefObject<HTMLDivElement>;
  };
  // editorState: this.state.editorState,
  // editorRef: this.editorRef,
  // inlineToolbarRef: this.inlineToolbarRef,
  // imageToolbarRef: this.imageToolbarRef,
  // sidebarRef: this.sidebarRef,
}

// export function GetEditor(): {
//   hooks: Hooks;
//   editorState: EditorState;
//   editorRef: RefObject<HTMLDivElement>;
//   inlineToolbarRef: RefObject<HTMLDivElement>;
//   imageToolbarRef: RefObject<HTMLDivElement>;
//   sidebarRef: RefObject<HTMLDivElement>;
// }

// https://stackoverflow.com/questions/50604272/typescript-property-foreach-does-not-exist-on-type-filelist
// https://stackoverflow.com/questions/46349147/property-foreach-does-not-exist-on-type-nodelistof
declare global {
  interface FileList {
    forEach(callback: (f: File) => void): void;
  }
}

export interface TimeoutHandler {
  (
    callback: (...args: any[]) => void,
    ms: number,
    ...args: any[]
  ): NodeJS.Timeout;
}
