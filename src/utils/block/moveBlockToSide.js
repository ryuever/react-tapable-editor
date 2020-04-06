import appendChildBlock from "./appendChildBlock";
import appendFlexChildBlock from "./appendFlexChildBlock";
import addBlockBefore from "./addBlockBefore";
import addBlockAfter from "./addBlockAfter";
import moveBlockBefore from "./moveBlockBefore";
import moveBlockAfter from "./moveBlockAfter";
import createEmptyBlockNode from "./createEmptyBlockNode";
import resetSibling from "./resetSibling";
import findRootNodeSibling from "./findRootNodeSibling";

// Note: you can only drag a pure block, which means block's children
// property should be empty list..
export default (blockMap, sourceBlockKey, targetBlockKey, position) => {
  try {
    const sourceBlock = blockMap.get(sourceBlockKey);
    const targetBlock = blockMap.get(targetBlockKey);
    const parentKey = targetBlock.parent;
    const parentBlock = blockMap.get(parentKey);

    const sourceNextSibling = sourceBlock.getNextSiblingKey();

    // 首先查看parentNode是否包含`isFlexRow` data
    // const isFlexRow = parentBlock.getData().get('flexRow')
    let newBlockMap = blockMap;
    let flexBlockKey;
    const nextKey = sourceBlock.getNextSiblingKey();

    if (!parentBlock) {
      const emptyBlock = createEmptyBlockNode();
      const flexBlock = emptyBlock.merge({
        data: emptyBlock.getData().merge({
          flexRow: true,
          getChildKeys: []
        })
      });
      flexBlockKey = flexBlock.getKey();

      if (position === "left") {
        const targetWrapperBlock = createEmptyBlockNode();
        const targetWrapperBlockKey = targetWrapperBlock.getKey();
        newBlockMap = addBlockBefore(
          newBlockMap,
          targetWrapperBlock,
          targetBlockKey
        );

        newBlockMap = appendChildBlock(
          newBlockMap,
          targetWrapperBlockKey,
          targetBlockKey
        );

        // 首先将sourceBlock放置到左边
        newBlockMap = moveBlockBefore(
          newBlockMap,
          sourceBlockKey,
          targetWrapperBlockKey
        );

        const sourceWrapperBlock = createEmptyBlockNode();
        const sourceWrapperBlockKey = sourceWrapperBlock.getKey();
        newBlockMap = addBlockBefore(
          newBlockMap,
          sourceWrapperBlock,
          sourceBlockKey
        );
        newBlockMap = appendChildBlock(
          newBlockMap,
          sourceWrapperBlockKey,
          sourceBlockKey
        );
        newBlockMap = addBlockBefore(
          newBlockMap,
          flexBlock,
          sourceWrapperBlockKey
        );
        newBlockMap = appendFlexChildBlock(
          newBlockMap,
          flexBlockKey,
          sourceWrapperBlockKey
        );
        newBlockMap = appendFlexChildBlock(
          newBlockMap,
          flexBlockKey,
          targetWrapperBlockKey
        );

        const nextSibling = findRootNodeSibling(newBlockMap, flexBlockKey);

        // // 找到从flexBlock开始，第一个parent不存在的
        const nextFlexBlock = newBlockMap.get(flexBlockKey);
        const newFlexBlock = nextFlexBlock.merge({
          nextSibling
        });

        newBlockMap = newBlockMap.set(flexBlockKey, newFlexBlock);
      }

      // If place on right, maybe you should hoist target block first...
      // 1. create a target wrapper, in order to press `enter` in subBlock works well.
      if (position === "right") {
        const targetWrapperBlock = createEmptyBlockNode();
        const targetWrapperBlockKey = targetWrapperBlock.getKey();
        // Place new parent block before processing block
        newBlockMap = addBlockBefore(
          newBlockMap,
          targetWrapperBlock,
          targetBlockKey
        );
        // Set new block as parent of processing block
        newBlockMap = appendChildBlock(
          newBlockMap,
          targetWrapperBlockKey,
          targetBlockKey
        );
        // 首先将sourceBlock放置到左边
        newBlockMap = moveBlockAfter(
          newBlockMap,
          sourceBlockKey,
          targetWrapperBlockKey
        );

        // wrap source block first...
        const sourceWrapperBlock = createEmptyBlockNode();
        const sourceWrapperBlockKey = sourceWrapperBlock.getKey();
        newBlockMap = addBlockBefore(
          newBlockMap,
          sourceWrapperBlock,
          sourceBlockKey
        );
        newBlockMap = appendChildBlock(
          newBlockMap,
          sourceWrapperBlockKey,
          sourceBlockKey
        );

        newBlockMap = addBlockBefore(
          newBlockMap,
          flexBlock,
          targetWrapperBlockKey
        );
        newBlockMap = appendFlexChildBlock(
          newBlockMap,
          flexBlockKey,
          targetWrapperBlockKey
        );
        newBlockMap = appendFlexChildBlock(
          newBlockMap,
          flexBlockKey,
          sourceWrapperBlockKey
        );
        const nextSibling = findRootNodeSibling(newBlockMap, flexBlockKey);

        // 找到从flexBlock开始，第一个parent不存在的
        const nextFlexBlock = newBlockMap.get(flexBlockKey);
        const newFlexBlock = nextFlexBlock.merge({
          nextSibling
        });

        newBlockMap = newBlockMap.set(flexBlockKey, newFlexBlock);
      }
    } else {
      // wrap source block first...
      const sourceWrapperBlock = createEmptyBlockNode();
      const sourceWrapperBlockKey = sourceWrapperBlock.getKey();
      newBlockMap = addBlockBefore(
        newBlockMap,
        sourceWrapperBlock,
        sourceBlockKey
      );
      newBlockMap = appendChildBlock(
        newBlockMap,
        sourceWrapperBlockKey,
        sourceBlockKey
      );
      const grandParentBlockKey = parentBlock.parent;
      newBlockMap = appendChildBlock(
        newBlockMap,
        grandParentBlockKey,
        sourceWrapperBlockKey
      );
    }
    return newBlockMap;
  } catch (err) {
    console.log("`moveBlockToSide` ", err);
  }
};
