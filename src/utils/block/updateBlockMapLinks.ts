import { ContentState } from 'draft-js'
import { BlockNodeMap } from '../../types'

export function findLastBlockWithNullParent(contentState: ContentState) {
  const blockMap = contentState.getBlockMap() as BlockNodeMap;
  return blockMap
    .reverse()
    .skipUntil(block => !block.parent)
    .take(1);
}
