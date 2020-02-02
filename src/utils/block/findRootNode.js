const findRootNode = (blockMap, blockKey) => {
  const block = blockMap.get(blockKey)
  if (!block) return null
  if (!block.parent) return block

  return findRootNode(blockMap, block.parent)
}

export default findRootNode