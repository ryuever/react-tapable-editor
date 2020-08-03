import { List } from 'immutable';
import blockUtil from './blockUtil';
import blockMutationUtil from './blockMutationUtil';
import { BlockNodeMap, ContentBlockNode } from '../../types';

/**
 * If target block has children, sourceBlock should be placed after all
 * of its children.
 */
function insertBlockAfter(
  blockMap: BlockNodeMap,
  targetBlock: ContentBlockNode | undefined,
  sourceBlock: ContentBlockNode | undefined
): BlockNodeMap {
  if (!sourceBlock || !targetBlock) return blockMap;

  const blocksBefore = blockUtil.blocksBefore(blockMap, targetBlock);
  const sourceBlockKey = sourceBlock.getKey();
  const targetBlockKey = targetBlock.getKey();

  const childrenBlocks = blockUtil.getChildrenBlocks(blockMap, targetBlock);
  const lastBlock = childrenBlocks.size
    ? childrenBlocks.last<ContentBlockNode>()
    : targetBlock;
  const blocksAfter = blockUtil.blocksAfter(blockMap, lastBlock);

  const newBlockMap = blocksBefore
    .concat([[targetBlock.getKey(), targetBlock]])
    .concat(childrenBlocks.size ? childrenBlocks.toSeq() : [])
    .concat([[sourceBlock.getKey(), sourceBlock]])
    .concat(blocksAfter)
    .toOrderedMap() as BlockNodeMap;

  return newBlockMap.withMutations(function(blocks) {
    blockMutationUtil.transformBlock(sourceBlockKey, blocks, function(block) {
      return block.merge({
        prevSibling: targetBlockKey,
        nextSibling: targetBlock.getNextSiblingKey(),
        parent: targetBlock.getParentKey(),
      });
    });

    blockMutationUtil.transformBlock(
      targetBlock.getParentKey(),
      blocks,
      function(block) {
        const parentChildrenList = block.getChildKeys();
        const newChildrenArray = parentChildrenList.toArray();
        newChildrenArray.push(sourceBlockKey);

        return block.merge({
          children: List(newChildrenArray),
        });
      }
    );

    blockMutationUtil.transformBlock(targetBlockKey, blocks, function(block) {
      return block.merge({
        nextSibling: sourceBlockKey,
      });
    });
  });
}

export default insertBlockAfter;
