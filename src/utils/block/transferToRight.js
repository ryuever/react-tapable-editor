import removeBlock from "./removeBlock";
import wrapBlock from "./wrapBlock";
import insertBlockAfter from "./insertBlockAfter";
import createEmptyBlockNode from "./createEmptyBlockNode";
import { List } from "immutable";

const transferToRight = (editorState, sourceBlockKey, targetBlockKey) => {
  const currentState = editorState.getCurrentContent();
  let blockMap = currentState.getBlockMap();
  blockMap = removeBlock(blockMap, sourceBlockKey);
  blockMap = wrapBlock(blockMap, targetBlockKey, "column");
  const parentKey = blockMap.get(targetBlockKey).parent;
  blockMap = wrapBlock(blockMap, parentKey, "row");

  let containerBlock = createEmptyBlockNode().merge({
    data: {
      flexRow: true,
      "data-wrapper": true,
      "data-direction": "column"
    },
    children: List([sourceBlockKey]),
    parent: null
  });

  insertBlockAfter(blockMap, blockMap.get(parentKey), containerBlock);

  return blockMap;
};

export default transferToRight;
