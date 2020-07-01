import { List } from "immutable";
import blockUtil from "./blockUtil";
import blockMutationUtil from "./blockMutationUtil";

const updateBlockMapLinks = () => {};

/**
 *
 * @param {*} editorState
 * @param {String} sourceBlockKey
 * @param {String} targetBlockKey
 * @param {String} position : one of values ['top', 'right', 'left']
 */

function removeBlock(blockMap, block, removeParentIfHasNoChild) {
  const blockToRemove = block;
  const blockKey = block.getKey();
  if (!blockToRemove) return blockMap;

  const blocksBefore = blockUtil.blocksBefore(blockMap, block);
  const blocksAfter = blockUtil.blocksAfter(blockMap, block);

  let newBlockMap = blocksBefore.concat(blocksAfter).toOrderedMap();

  const parentKey = blockToRemove.parent;

  blockMutationUtil.transformBlock(parentKey, newBlockMap, function(block) {
    blockMutationUtil.deleteFromChildrenList(block, blockKey);
  });

  const newParentBlock = newBlockMap.get(parentKey);
  const childrenSize = blockUtil.getChildrenSize(newParentBlock);

  if (removeParentIfHasNoChild && !childrenSize) {
    return removeBlock(newBlockMap, newParentBlock, removeParentIfHasNoChild);
  } else {
    blockMutationUtil.transformBlock(
      blockToRemove.getPrevSiblingKey(),
      newBlockMap,
      function(block) {
        return block.merge({
          nextSibling: blockToRemove.getNextSiblingKey()
        });
      }
    );

    blockMutationUtil.transformBlock(
      blockToRemove.getNextSiblingKey(),
      newBlockMap,
      function(block) {
        return block.merge({
          prevSibling: blockToRemove.getPrevSiblingKey()
        });
      }
    );
  }

  return newBlockMap;
}

export default removeBlock;
