export default (
  blockMap,
  newBlock,
  targetBlockKey,
) => {
  const targetBlock = blockMap.get(targetBlockKey)
  if (!targetBlock) return

  const newBlockKey = newBlock.getKey()

  const blocksBefore = blockMap.toSeq().takeUntil(function (v) {
    return v === targetBlock;
  });
  const blocksAfter = blockMap.toSeq().skipUntil(function (v) {
    return v === targetBlock;
  }).rest();

  let newBlockMap = blocksBefore.concat([
    [newBlockKey, newBlock],
    [targetBlockKey, targetBlock],
  ], blocksAfter).toOrderedMap();

  const parentKey = targetBlock.parent;
  const parentBlock = blockMap.get(parentKey)

  if (parentBlock) {
    // adjust parent children
    const childKeys = parentBlock.getChildKeys()
    const insertionIndex = childKeys.indexOf(targetBlockKey)
    const childKeysArray = childKeys.toArray()
    childKeysArray.splice(insertionIndex, 0, newBlockKey)

    const newParentBlock = parentBlock.merge({
      children: List(childKeysArray),
    })

    newBlockMap = newBlockMap.set(parentKey, newParentBlock)
  }

  const prevSiblingKey = targetBlock.getPrevSiblingKey()

  if (prevSiblingKey) {
    const prevSiblingBlock = newBlockMap.get(prevSiblingKey)
    const newPrevSiblingBlock = prevSiblingBlock.merge({
      nextSibling: newBlockKey
    })
    newBlockMap = newBlockMap.set(prevSiblingKey, newPrevSiblingBlock)
  }

  {
    const nextNewBlock = newBlock.merge({
      prevSibling: prevSiblingKey,
      nextSibling: targetBlockKey
    })
    newBlockMap = newBlockMap.set(newBlockKey, nextNewBlock)
  }

  {
    const newTargetBlock = targetBlock.merge({
      prevSibling: newBlockKey,
    })
    newBlockMap = newBlockMap.set(targetBlockKey, newTargetBlock)
  }

  return newBlockMap
}