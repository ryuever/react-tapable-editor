import { List } from 'immutable';
import blockUtil from './blockUtil';
import blockMutationUtil from './blockMutationUtil';
import { BlockNodeMap, ContentBlockNode } from '../../types';

export enum InsertChildBlockDirection {
  Forward = 'forward',
  Backward = 'backward',
}

/**
 * If target block has children, childBlock should be placed after all
 * of its children.
 */
function insertChildBlock({
  blockMap,
  parentBlock,
  indexBlock,
  childBlock,
  direction,
}: {
  blockMap: BlockNodeMap;
  parentBlock: ContentBlockNode;
  indexBlock: ContentBlockNode;
  childBlock: ContentBlockNode;
  direction: InsertChildBlockDirection;
}) {
  const indexParentKey = indexBlock.getParentKey();
  const parentBlockKey = parentBlock.getKey();

  if (indexParentKey !== parentBlockKey) {
    throw new Error(
      'in `insertChild` function, `indexParentKey` and `parentBlockKey` should be the same'
    );
  }

  const blocksBefore = blockUtil.blocksBefore(blockMap, indexBlock);
  const blocksAfter = blockUtil.blocksAfter(blockMap, indexBlock);
  const childBlockKey = childBlock.getKey();
  const indexBlockKey = indexBlock.getKey();

  let newBlockMap;

  if (direction === 'forward') {
    newBlockMap = blocksBefore
      .concat([[childBlock.getKey(), childBlock]])
      .concat([[indexBlockKey, indexBlock]])
      .concat(blocksAfter)
      .toOrderedMap();
  } else {
    const indexBlockChildren = blockUtil.getChildrenBlocks(
      blockMap,
      indexBlock
    );
    const indexBlockChildrenLast = indexBlockChildren.size
      ? indexBlockChildren.last<ContentBlockNode>()
      : parentBlock;
    const blocksAfter = blockUtil.blocksAfter(blockMap, indexBlockChildrenLast);
    newBlockMap = blocksBefore
      .concat([[indexBlockKey, indexBlock]])
      .concat(indexBlockChildren.size ? indexBlockChildren.toSeq() : [])
      .concat([[childBlock.getKey(), childBlock]])
      .concat(blocksAfter)
      .toOrderedMap();
  }

  return newBlockMap.withMutations(function(blocks) {
    if (direction === 'forward') {
      blockMutationUtil.transformBlock(childBlockKey, blocks, function(block) {
        return block.merge({
          parent: parentBlockKey,
          prevSibling: indexBlock ? indexBlock.getPrevSiblingKey() : null,
          nextSibling: indexBlock ? indexBlockKey : null,
        });
      });
      blockMutationUtil.transformBlock(indexBlockKey, blocks, function(block) {
        return block.merge({
          prevSibling: childBlockKey,
        });
      });
    } else {
      blockMutationUtil.transformBlock(childBlockKey, blocks, function(block) {
        return block.merge({
          parent: parentBlockKey,
          prevSibling: indexBlock ? indexBlockKey : null,
          nextSibling: indexBlock ? indexBlock.getNextSiblingKey() : null,
        });
      });
      blockMutationUtil.transformBlock(indexBlockKey, blocks, function(block) {
        return block.merge({
          nextSibling: childBlockKey,
        });
      });
    }

    blockMutationUtil.transformBlock(parentBlockKey, blocks, function(block) {
      const parentChildrenList = block.getChildKeys();
      const newChildrenArray = parentChildrenList.toArray();
      const index = newChildrenArray.indexOf(indexBlockKey);
      if (direction === 'forward') {
        newChildrenArray.splice(index, 0, childBlockKey);
      } else {
        newChildrenArray.splice(index + 1, 0, childBlockKey);
      }

      return block.merge({
        children: List(newChildrenArray),
      });
    });
  });
}

export default insertChildBlock;
