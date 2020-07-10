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
