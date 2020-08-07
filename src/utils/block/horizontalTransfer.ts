import { List, Map } from 'immutable';
import { EditorState } from 'draft-js';
import removeBlock from './removeBlock';
import wrapBlock from './wrapBlock';
import createEmptyBlockNode from './createEmptyBlockNode';
import appendChild from './appendChild';
import { Position, BlockNodeMap, Direction } from '../../types';
import insertChildBlock, { InsertChildBlockDirection } from './insertChild';

const horizontalTransfer = (
  editorState: EditorState,
  sourceBlockKey: string,
  targetBlockKey: string,
  direction: Position
) => {
  const containerBlock = createEmptyBlockNode().merge({
    data: {
      flexRow: true,
      'data-wrapper': true,
      'data-direction': 'column',
    },
    children: List([]),
    parent: null,
  });
  const containerBlockKey = containerBlock.getKey();

  // remove the moved block
  const currentState = editorState.getCurrentContent();
  let blockMap = currentState.getBlockMap() as BlockNodeMap;
  const sourceBlock = blockMap.get(sourceBlockKey);
  blockMap = removeBlock(blockMap, sourceBlockKey);

  const targetBlock = blockMap.get(targetBlockKey);
  const targetBlockParentKey = targetBlock?.getParentKey();
  let parentBlockData = Map();
  let targetParentBlock;
  if (targetBlockParentKey) {
    targetParentBlock = blockMap.get(targetBlockParentKey);
    parentBlockData = targetParentBlock!.getData();
  }

  if (parentBlockData.get('data-direction') === 'row' && targetParentBlock) {
    blockMap = insertChildBlock({
      blockMap,
      parentBlock: targetParentBlock,
      indexBlock: targetBlock!,
      childBlock: containerBlock,
      direction:
        direction === 'left'
          ? InsertChildBlockDirection.Forward
          : InsertChildBlockDirection.Backward,
    });

    // should use blockMap.get(containerBlockKey)! to get latest `containerBlock`
    blockMap = appendChild(
      blockMap,
      blockMap.get(containerBlockKey)!,
      sourceBlock!
    )!;
  } else {
    blockMap = wrapBlock(blockMap, targetBlockKey, Direction.Column);
    const parentKey = blockMap!.get(targetBlockKey)!.getParentKey();
    blockMap = wrapBlock(blockMap, parentKey, Direction.Row);
    const grandParentKey = blockMap.get(parentKey)?.getParentKey();

    blockMap = insertChildBlock({
      blockMap,
      parentBlock: blockMap.get(grandParentKey!)!,
      indexBlock: blockMap.get(parentKey)!,
      childBlock: containerBlock,
      direction:
        direction === 'left'
          ? InsertChildBlockDirection.Forward
          : InsertChildBlockDirection.Backward,
    });

    const parentBlock = blockMap.get(containerBlock.getKey());

    if (parentBlock && sourceBlock) {
      blockMap = appendChild(blockMap, parentBlock, sourceBlock)!;
    }
  }

  return blockMap;
};

export default horizontalTransfer;
