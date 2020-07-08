import removeBlock from "./removeBlock";
import wrapBlock from "./wrapBlock";
import insertBlockAfter from "./insertBlockAfter";
import createEmptyBlockNode from "./createEmptyBlockNode";
import appendChild from "./appendChild";
import { List } from "immutable";

const transferToRight = (editorState, sourceBlockKey, targetBlockKey) => {
  const currentState = editorState.getCurrentContent();
  let blockMap = currentState.getBlockMap();
  const sourceBlock = blockMap.get(sourceBlockKey);
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
    children: List([]),
    parent: null
  });

  blockMap = insertBlockAfter(
    blockMap,
    blockMap.get(parentKey),
    containerBlock
  );
  blockMap = appendChild(
    blockMap,
    blockMap.get(containerBlock.getKey()),
    sourceBlock
  );
  return blockMap;
};

export default transferToRight;
