import { EditorState } from 'draft-js';
import insertBlockBefore from './insertBlockBefore';
import insertBlockAfter from './insertBlockAfter';
import removeBlock from './removeBlock';
import { Position, BlockNodeMap } from '../../types';

const verticalTransfer = (
  editorState: EditorState,
  sourceBlockKey: string,
  targetBlockKey: string,
  position: Position
): BlockNodeMap => {
  const currentState = editorState.getCurrentContent();
  let blockMap = currentState.getBlockMap() as BlockNodeMap;
  const sourceBlock = blockMap.get(sourceBlockKey);
  const targetBlock = blockMap.get(targetBlockKey);
  blockMap = removeBlock(blockMap, sourceBlockKey);
  if (position === 'top') {
    return insertBlockBefore(blockMap, targetBlock, sourceBlock);
  }

  if (position === 'bottom') {
    return insertBlockAfter(blockMap, targetBlock, sourceBlock);
  }

  return blockMap;
};

export default verticalTransfer;
