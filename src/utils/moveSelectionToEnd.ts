import { EditorState, SelectionState } from 'draft-js';
import { BlockNodeMap, ContentBlockNode } from 'types';

/**
 * Returns a new EditorState where the Selection is at the end.
 *
 * This ensures to mimic the textarea behaviour where the Selection is placed at
 * the end. This is needed when blocks (like stickers or other media) are added
 * without the editor having had focus yet. It still works to place the
 * Selection at a specific location by clicking on the text.
 */
const moveSelectionToEnd = (editorState: EditorState) => {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap() as BlockNodeMap;

  const key = blockMap.last<ContentBlockNode>().getKey();
  const length = blockMap.last<ContentBlockNode>().getLength();

  const selection = new SelectionState().merge({
    anchorKey: key,
    anchorOffset: length,
    focusKey: key,
    focusOffset: length,
  });

  return EditorState.acceptSelection(editorState, selection);
};

export default moveSelectionToEnd;
