import blockUtil from "./blockUtil";
import blockMutationUtil from "./blockMutationUtil";

/**
 *
 * @param {*} editorState
 * @param {String} sourceBlockKey
 * @param {String} targetBlockKey
 * @param {String} position : one of values ['top', 'right', 'left']
 */

function removeBlock(blockMap, block, removeParentIfHasNoChild) {
  let blockToRemove;
  let blockKey;

  if (typeof block === "string") {
    blockToRemove = blockMap.get(block);
    blockKey = block;
  } else {
    blockToRemove = block;
    blockKey = block.getKey();
  }

  if (!blockToRemove) return blockMap;

  const blocksBefore = blockUtil.blocksBefore(blockMap, blockToRemove);
  const blocksAfter = blockUtil.blocksAfter(blockMap, blockToRemove);
  let newBlockMap = blocksBefore.concat(blocksAfter).toOrderedMap();
  const parentKey = blockToRemove.parent;

  newBlockMap.withMutations(function(blocks) {
    blockMutationUtil.transformBlock(parentKey, blocks, function(block) {
      blockMutationUtil.deleteFromChildrenList(block, blockKey);
    });
  });

  const newParentBlock = newBlockMap.get(parentKey);
  const childrenSize = blockUtil.getChildrenSize(newParentBlock);

  if (removeParentIfHasNoChild && !childrenSize) {
    return removeBlock(newBlockMap, newParentBlock, removeParentIfHasNoChild);
  }

  return newBlockMap.withMutations(function(blocks) {
    blockMutationUtil.transformBlock(
      blockToRemove.getPrevSiblingKey(),
      blocks,
      function(block) {
        return block.merge({
          nextSibling: blockToRemove.getNextSiblingKey()
        });
      }
    );

    blockMutationUtil.transformBlock(
      blockToRemove.getNextSiblingKey(),
      blocks,
      function(block) {
        return block.merge({
          prevSibling: blockToRemove.getPrevSiblingKey()
        });
      }
    );
  });
}

export default removeBlock;
