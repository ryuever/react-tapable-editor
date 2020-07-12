import { ContentState } from 'draft-js';
import { BlockNodeMap } from '../../types';

export function findLastBlockWithNullParent(
  contentState: ContentState
): BlockNodeMap {
  const blockMap = contentState.getBlockMap() as BlockNodeMap;
  return blockMap
    .reverse()
    .skipUntil(block => !block.getParentKey())
    .take(1);
}
