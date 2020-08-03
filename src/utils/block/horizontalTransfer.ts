import { List } from 'immutable';
import { EditorState } from 'draft-js';
import removeBlock from './removeBlock';
import wrapBlock from './wrapBlock';
import insertBlockBefore from './insertBlockBefore';
import insertBlockAfter from './insertBlockAfter';
import createEmptyBlockNode from './createEmptyBlockNode';
import appendChild from './appendChild';
import { Position, BlockNodeMap, Direction } from '../../types';

const horizontalTransfer = (
  editorState: EditorState,
  sourceBlockKey: string,
  targetBlockKey: string,
  direction: Position
) => {
  const currentState = editorState.getCurrentContent();
  let blockMap = currentState.getBlockMap() as BlockNodeMap;
  const sourceBlock = blockMap.get(sourceBlockKey);
  blockMap = removeBlock(blockMap, sourceBlockKey);
  blockMap = wrapBlock(blockMap, targetBlockKey, Direction.Column);
  const parentKey = blockMap!.get(targetBlockKey)!.getParentKey();
  blockMap = wrapBlock(blockMap, parentKey, Direction.Row);

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

  if (typeof fn === 'function')
    blockMap = fn.call(null, blockMap, blockMap.get(parentKey), containerBlock);
  const parentBlock = blockMap.get(containerBlock.getKey());

  if (parentBlock && sourceBlock) {
    blockMap = appendChild(blockMap, parentBlock, sourceBlock);
  }

  return blockMap;
};

export default horizontalTransfer;
