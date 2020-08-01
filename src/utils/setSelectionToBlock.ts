import { SelectionState, EditorState } from 'draft-js';
// @ts-ignore
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import { ContentBlockNode } from '../types';

// Set selection of editor to next/previous block
export default (editorState: EditorState, contentBlock: ContentBlockNode) => {
  const blockKey = contentBlock.getKey();
  // TODO verify that always a key-0-0 exists
  const offsetKey = DraftOffsetKey.encode(blockKey, 0, 0);
  const node = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0];
  // set the native selection to the node so the caret is not in the text and
  // the selectionState matches the native selection
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStart(node, 0);
  range.setEnd(node, 0);
  selection!.removeAllRanges();
  selection!.addRange(range);

  return EditorState.forceSelection(
    editorState,
    new SelectionState().merge({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 0,
      isBackward: false,
    })
  );
};
