import { List } from 'immutable';
import blockMutationUtil from './blockMutationUtil';
import blockUtil from './blockUtil';
import { BlockNodeMap, ContentBlockNode } from '../../types';

function insertBlockBefore(
  blockMap: BlockNodeMap,
  targetBlock: ContentBlockNode | undefined,
  sourceBlock: ContentBlockNode | undefined
): BlockNodeMap {
  if (!targetBlock || !sourceBlock) return blockMap;

  const blocksBefore = blockUtil.blocksBefore(blockMap, targetBlock);
  const blocksAfter = blockUtil.blocksAfter(blockMap, targetBlock);
  const sourceBlockKey = sourceBlock.getKey();
  const targetBlockKey = targetBlock.getKey();
  const targetParentKey = targetBlock.getParentKey();
  const targetOriginPrevSibling = targetBlock.getPrevSiblingKey();
  const targetOriginNextSibling = targetBlock.getNextSiblingKey();

  const newBlockMap = blocksBefore
    .concat([
      [sourceBlockKey, sourceBlock],
      [targetBlockKey, targetBlock],
    ])
    .concat(blocksAfter)
    .toOrderedMap() as BlockNodeMap;

  return newBlockMap.withMutations(function(blocks) {
    blockMutationUtil.transformBlock(sourceBlockKey, blocks, function(block) {
      return block.merge({
        prevSibling: targetOriginPrevSibling,
        nextSibling: targetBlockKey,
      });
    });

    blockMutationUtil.transformBlock(
      targetBlock.getPrevSiblingKey(),
      blocks,
      function(block) {
        return block.merge({
          nextSibling: sourceBlockKey,
        });
      }
    );

    blockMutationUtil.transformBlock(targetBlockKey, blocks, function(block) {
      return block.merge({
        prevSibling: sourceBlockKey,
        nextSibling: targetOriginNextSibling,
      });
    });

    blockMutationUtil.transformBlock(targetParentKey, blocks, function(block) {
      const parentChildrenList = block.getChildKeys();
      const newChildrenArray = parentChildrenList.toArray();
      const index = newChildrenArray.indexOf(targetBlockKey);
      newChildrenArray.splice(index, 0, sourceBlockKey);

      return block.merge({
        children: List(newChildrenArray),
      });
    });
  });
}

export default insertBlockBefore;
