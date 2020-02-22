import Immutable from "immutable";

const { Map } = Immutable;

function getSelectionBlockTypes(editorState) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  const blockTypes = [];
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
      const currentBlockType = block.getType();
      if (blockTypes.indexOf(currentBlockType) === -1) {
        blockTypes.push(currentBlockType);
      }
    });

  return blockTypes;
}

export default getSelectionBlockTypes;
