import createEmptyBlockNode from "./createEmptyBlockNode";
import removeBlock from "./removeBlock";
import blockMutationUtil from "./blockMutationUtil";
import { List } from "immutable";

const wrapBlock = (editorState, sourceBlockKey, targetBlockKey) => {
  const currentContent = editorState.getCurrentContent();
  let blockMap = currentContent.getBlockMap();
  const targetBlock = blockMap.get(targetBlockKey);
  const parentBlockKey = targetBlock.getParentKey();
  const parentBlock = blockMap.get(parentBlockKey);
  const data = parentBlock.getData();

  if (!data.flexRow) {
    const containerBlock = createEmptyBlockNode();
    containerBlock.set("data", parentBlock.getData().merge({ flexRow: true }));
    containerBlock.set("parent", parentBlockKey);

    const blockToRemove = blockMap.get(sourceBlockKey);
    blockMap = removeBlock(blockMap, blockToRemove, true);
    const childrenList = parentBlock.getChildKeys();

    // splitBlockInContentState.js
    const insertionIndex = childrenList.indexOf(targetBlockKey) + 1;
    var newChildrenArray = parentChildrenList.toArray();
    newChildrenArray.splice(insertionIndex, 0, belowBlockKey);
    const parentKey = parentBlock.getKey();

    blockMap.set(
      parentKey,
      block.merge({
        children: List(newChildrenArray)
      })
    );
    const targetBlock = blockMap.get(targetBlockKey);

    blockMap = removeBlock(blockMap, targetBlock, false);

    containerBlock.setIn("prevSibling", targetBlock.getPreSibling());
    containerBlock.setIn("nextSibling", targetBlock.getNextSibling());

    const nextTargetBlock = targetBlock.merge({
      prevSibling: null,
      nextSibling: null,
      parent: containerBlock.getKey()
    });

    BlockMutationUtil.transformBlock(
      containerBlock.getKey(),
      blockMap,
      function(block) {
        return block.merge({
          children: List(targetBlockKey)
        });
      }
    );

    const blocksBefore = blockUtil.blocksBefore(blockMap, targetBlock);
    const blocksAfter = blockUtil.blocksAfter(blockMap, targetBlock);

    return blocksBefore
      .concat([
        [containerBlockKey, containerBlock],
        [targetBlockKey, nextTargetBlock]
      ])
      .concat(blocksAfter)
      .toOrderedMap();
  }
};

export default wrapBlock;
