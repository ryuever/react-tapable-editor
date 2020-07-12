import { BlockNodeMap, ContentBlockNode } from '../../types';

const findRootNode = (
  blockMap: BlockNodeMap,
  blockKey: string
): null | ContentBlockNode => {
  const block = blockMap.get(blockKey);
  if (!block) return null;
  if (!block.getParentKey()) return block;

  return findRootNode(blockMap, block.getParentKey());
};

export default findRootNode;
