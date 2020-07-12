import Immutable from 'immutable';
import { EditorState, DraftBlockType, ContentBlock } from 'draft-js';

const { Map } = Immutable;

function getSelectionBlockTypes(editorState: EditorState): DraftBlockType[] {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  const blockTypes = [] as DraftBlockType[];
  blockMap
    .toSeq()
    .skipUntil(function(_, k) {
      return k === startKey;
    })
    .takeUntil(function(_, k) {
      return k === endKey;
    })
    .concat(Map([[endKey, blockMap.get(endKey)]]))
    .forEach(block => {
      if (!block) return;
      const currentBlockType = (block as ContentBlock).getType();
      if (blockTypes.indexOf(currentBlockType) === -1) {
        blockTypes.push(currentBlockType);
      }
    });

  return blockTypes;
}

export default getSelectionBlockTypes;
