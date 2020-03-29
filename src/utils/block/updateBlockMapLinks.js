export function findLastBlockWithNullParent(contentState) {
  const blockMap = contentState.getBlockMap();
  return blockMap.skipUntil(block => !block.parent).take(1);
}
