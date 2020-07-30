import { List } from 'immutable';
import blockUtil from './blockUtil';
import blockMutationUtil from './blockMutationUtil';
import { BlockNodeMap, ContentBlockNode } from '../../types';

/**
 * If target block has children, childBlock should be placed after all
 * of its children.
 */
function appendChild(
  blockMap: BlockNodeMap,
  parentBlock: ContentBlockNode,
  childBlock: ContentBlockNode
) {
  const blocksBefore = blockUtil.blocksBefore(blockMap, parentBlock);
  const childBlockKey = childBlock.getKey();
  const parentBlockKey = parentBlock.getKey();

  const childrenBlocks = blockUtil.getChildrenBlocks(blockMap, parentBlock);

  const lastBlock = childrenBlocks.size ? childrenBlocks.last() : parentBlock;
  const blocksAfter = blockUtil.blocksAfter(blockMap, lastBlock);

  const newBlockMap = blocksBefore
    .concat([[parentBlock.getKey(), parentBlock]])
    .concat(childrenBlocks.size ? childrenBlocks.toSeq() : [])
    .concat([[childBlock.getKey(), childBlock]])
    .concat(blocksAfter)
    .toOrderedMap();

  return newBlockMap.withMutations(function(blocks) {
    blockMutationUtil.transformBlock(childBlockKey, blocks, function(block) {
      return block.merge({
        parent: parentBlockKey,
        prevSibling: childrenBlocks.size ? lastBlock.getNextSiblingKey() : null,
      });
    });

    blockMutationUtil.transformBlock(parentBlockKey, blocks, function(block) {
      const parentChildrenList = block.getChildKeys();
      const newChildrenArray = parentChildrenList.toArray();
      newChildrenArray.push(childBlockKey);

      return block.merge({
        children: List(newChildrenArray),
      });
    });
  });
}

export default appendChild;
