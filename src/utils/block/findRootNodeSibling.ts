import { BlockNodeMap } from '../../types';

export default (blockMap: BlockNodeMap, blockKey: string): null | string => {
  const block = blockMap
    .toSeq()
    .skipUntil(block => {
      return block.getKey() === blockKey;
    })
    .skip(1)
    .find(block => {
      return !block.getParentKey();
    });

  if (block) return block.getKey();
  return null;
};
