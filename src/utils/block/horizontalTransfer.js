import { List } from 'immutable';
import removeBlock from './removeBlock';
import wrapBlock from './wrapBlock';
import insertBlockBefore from './insertBlockBefore';
import insertBlockAfter from './insertBlockAfter';
import createEmptyBlockNode from './createEmptyBlockNode';
import appendChild from './appendChild';

const horizontalTransfer = (
  editorState,
  sourceBlockKey,
  targetBlockKey,
  direction
) => {
  const currentState = editorState.getCurrentContent();
  let blockMap = currentState.getBlockMap();
  const sourceBlock = blockMap.get(sourceBlockKey);
  blockMap = removeBlock(blockMap, sourceBlockKey);
  blockMap = wrapBlock(blockMap, targetBlockKey, 'column');
  const parentKey = blockMap.get(targetBlockKey).parent;
  blockMap = wrapBlock(blockMap, parentKey, 'row');

  const containerBlock = createEmptyBlockNode().merge({
    data: {
      flexRow: true,
      'data-wrapper': true,
      'data-direction': 'column',
    },
    children: List([]),
    parent: null,
  });

  let fn;
  switch (direction) {
    case 'left':
      fn = insertBlockBefore;
      break;
    case 'right':
      fn = insertBlockAfter;
      break;
  }

  blockMap = fn.call(null, blockMap, blockMap.get(parentKey), containerBlock);

  blockMap = appendChild(
    blockMap,
    blockMap.get(containerBlock.getKey()),
    sourceBlock
  );

  return blockMap;
};

export default horizontalTransfer;
