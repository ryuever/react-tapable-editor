import insertBlockBefore from "./insertBlockBefore";
import insertBlockAfter from "./insertBlockAfter";
import removeBlock from "./removeBlock";

const verticalTransfer = (
  editorState,
  sourceBlockKey,
  targetBlockKey,
  direction
) => {
  const currentState = editorState.getCurrentContent();
  let blockMap = currentState.getBlockMap();
  const sourceBlock = blockMap.get(sourceBlockKey);
  const targetBlock = blockMap.get(targetBlockKey);
  blockMap = removeBlock(blockMap, sourceBlockKey);
  if (direction === "top") {
    return insertBlockBefore(blockMap, targetBlock, sourceBlock);
  }

  if (direction === "bottom") {
    return insertBlockAfter(blockMap, targetBlock, sourceBlock);
  }
};

export default verticalTransfer;
