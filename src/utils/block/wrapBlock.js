import { List } from 'immutable';
import createEmptyBlockNode from './createEmptyBlockNode';
import removeBlock from './removeBlock';
import blockMutationUtil from './blockMutationUtil';
import blockUtil from './blockUtil';

/**
 *
 * @param {*} editorState
 * @param {*} sourceBlockKey
 * @param {*} targetBlockKey
 *
 * The parent of topMost block is null...
 */
const wrapBlock = (originalBlockMap, targetBlockKey, direction = 'row') => {
  let blockMap = originalBlockMap;
  const targetBlock = blockMap.get(targetBlockKey);
  const parentBlockKey = targetBlock.getParentKey();
  const parentBlock = blockMap.get(parentBlockKey);

  let parentData;
  if (parentBlock) {
    parentData = parentBlock.getData();
  }

  if (!parentData || !parentData.flexRow) {
    const containerBlock = createEmptyBlockNode().merge({
      data: {
        flexRow: true,
        'data-wrapper': true,
        'data-direction': direction,
      },
      children: List([targetBlockKey]),
      parent: parentBlockKey,
    });

    const containerBlockKey = containerBlock.getKey();

    if (parentBlock) {
      const childrenList = parentBlock.getChildKeys();

      // splitBlockInContentState.js
      const insertionIndex = childrenList.indexOf(targetBlockKey) + 1;
      const newChildrenArray = parentChildrenList.toArray();
      newChildrenArray.splice(insertionIndex, 0, belowBlockKey);
      const parentKey = parentBlock.getKey();

      blockMap = blockMap.set(
        parentKey,
        block.merge({
          children: List(newChildrenArray),
        })
      );
    }

    const blocksBefore = blockUtil.blocksBefore(blockMap, targetBlock);
    const blocksAfter = blockUtil.blocksAfter(blockMap, targetBlock);

    blockMap = blocksBefore
      .concat([
        [containerBlockKey, containerBlock],
        [targetBlockKey, targetBlock],
      ])
      .concat(blocksAfter)
      .toOrderedMap();

    return blockMap.withMutations(function(blocks) {
      blockMutationUtil.transformBlock(containerBlockKey, blocks, function(
        block
      ) {
        return block.merge({
          prevSibling: targetBlock.getPrevSiblingKey(),
          nextSibling: targetBlock.getNextSiblingKey(),
        });
      });

      blockMutationUtil.transformBlock(
        targetBlock.getPrevSiblingKey(),
        blocks,
        function(block) {
          return block.merge({
            nextSibling: containerBlockKey,
          });
        }
      );
      blockMutationUtil.transformBlock(
        targetBlock.getNextSiblingKey(),
        blocks,
        function(block) {
          return block.merge({
            prevSibling: containerBlockKey,
          });
        }
      );

      blockMutationUtil.transformBlock(targetBlockKey, blocks, function(block) {
        return block.merge({
          prevSibling: null,
          nextSibling: null,
          parent: containerBlock.getKey(),
        });
      });
    });
  }
};

export default wrapBlock;
