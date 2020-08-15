import { BlockNodeMap, ContentBlockNode } from '../../types';
import removeBlock from './removeBlock';

/**
 *
 * @param blockMap
 *
 * 1. If current block is in `column` direction and text is empty string...
 */
const removeBlockWithClear = (
  blockMap: BlockNodeMap,
  block: ContentBlockNode | string | undefined
) => {
  let blockToRemove: ContentBlockNode | undefined;

  if (!block) {
    return blockMap;
  }
  if (typeof block === 'string') {
    blockToRemove = blockMap.get(block);
  } else {
    blockToRemove = block;
  }

  if (!blockToRemove) return blockMap;

  const parentKey = blockToRemove!.getParentKey();

  let newBlockMap = removeBlock(blockMap, block);

  if (!parentKey) return newBlockMap;

  const parentBlock = newBlockMap.get(parentKey);
  const parentBlockData = parentBlock?.getData();
  const parentDirection = parentBlockData?.get('data-direction');
  const parentText = parentBlock?.getText();
  const parentChildrenLength = parentBlock?.getCharacterList().size;

  if (
    parentDirection === 'column' &&
    !parentChildrenLength &&
    parentText === ''
  ) {
    newBlockMap = removeBlock(newBlockMap, parentBlock);
  }

  return newBlockMap;
};

export default removeBlockWithClear;
