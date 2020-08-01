import { List, Map } from 'immutable';
import createEmptyBlockNode from './createEmptyBlockNode';
import blockMutationUtil from './blockMutationUtil';
import blockUtil from './blockUtil';
import { BlockNodeMap, Direction, WrapperProps } from '../../types';

/**
 *
 * @param {*} editorState
 * @param {*} sourceBlockKey
 * @param {*} targetBlockKey
 *
 * The parent of topMost block is null...
 */
const wrapBlock = (
  originalBlockMap: BlockNodeMap,
  targetBlockKey: string,
  direction: Direction = Direction.Row
): BlockNodeMap => {
  let blockMap = originalBlockMap;
  const targetBlock = blockMap.get(targetBlockKey);
  if (!targetBlock) return originalBlockMap;
  const parentBlockKey = targetBlock.getParentKey();
  const parentBlock = blockMap.get(parentBlockKey);

  let parentData: WrapperProps = Map<undefined, undefined>();
  if (parentBlock) {
    parentData = parentBlock.getData();
  }

  if (!parentData || !parentData.get('flexRow')) {
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
      const parentChildrenList = parentBlock.getChildKeys();

      // TODO: splitBlockInContentState.js
      const newChildrenArray = parentChildrenList.toArray();
      const insertionIndex = newChildrenArray.indexOf(targetBlockKey);
      newChildrenArray.splice(insertionIndex, 0, targetBlockKey);
      const parentKey = parentBlock.getKey();

      blockMap = blockMap.set(
        parentKey,
        parentBlock.merge({
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
      .toOrderedMap() as BlockNodeMap;

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

  return originalBlockMap;
};

export default wrapBlock;
