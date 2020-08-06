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
  blockMap = removeBlock(blockMap, sourceBlockKey);
  // Note: targetBlock should be placed after `removeBlock`, because
  // its sibling has changed after `removeBlock`; `hooks.setState` may
  // cause loop due to the same `prevSibling` and `nextSibling`..
  const targetBlock = blockMap.get(targetBlockKey);

  if (position === 'top') {
    return insertBlockBefore(blockMap, targetBlock, sourceBlock);
  }

  if (position === 'bottom') {
    return insertBlockAfter(blockMap, targetBlock, sourceBlock);
  }

  return blockMap;
};

export default verticalTransfer;
