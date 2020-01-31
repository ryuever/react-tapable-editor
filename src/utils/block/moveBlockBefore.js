import removeBlock from './removeBlock'

export default (
  blockMap,
  sourceBlock,
  targetBlock,
) => {
  const blockMapAfterRemove = removeBlock(blockMap, sourceBlock)
  if (!blockMapAfterRemove) return

  const targetBlockKey = targetBlock.getKey()
  const sourceBlockKey = sourceBlock.getKey()
  if (!targetBlock) return

  const blocksBefore = blockMapAfterRemove.toSeq().takeUntil(function (v) {
    return v === targetBlock;
  });
  const blocksAfter = blockMapAfterRemove.toSeq().skipUntil(function (v) {
    return v === targetBlock;
  }).rest();

  let newBlockMap = blocksBefore.concat([
    [sourceBlockKey, sourceBlock],
    [targetBlockKey, targetBlock],
  ], blocksAfter).toOrderedMap();

  const parentKey = targetBlock.parent;
  const parentBlock = blockMapAfterRemove.get(parentKey)

  if (parentBlock) {
    // adjust parent children
    const childKeys = parentBlock.getChildKeys()
    const insertionIndex = childKeys.indexOf(targetBlockKey)
    const childKeysArray = childKeys.toArray()
    childKeysArray.splice(insertionIndex, 0, sourceBlockKey)

    const newParentBlock = parentBlock.merge({
      children: List(childKeysArray),
    })

    newBlockMap = newBlockMap.set(parentKey, newParentBlock)
  }

  const prevSiblingKey = targetBlock.getPrevSiblingKey()

  if (prevSiblingKey) {
    const prevSiblingBlock = newBlockMap.get(prevSiblingKey)
    const newPrevSiblingBlock = prevSiblingBlock.merge({
      nextSibling: sourceBlockKey
    })
    newBlockMap = newBlockMap.set(prevSiblingKey, newPrevSiblingBlock)
  }

  {
    const newSourceBlock = sourceBlock.merge({
      prevSibling: prevSiblingKey,
      nextSibling: targetBlockKey
    })
    newBlockMap = newBlockMap.set(sourceBlockKey, newSourceBlock)
  }

  {
    const newTargetBlock = targetBlock.merge({
      prevSibling: sourceBlockKey,
    })
    newBlockMap = newBlockMap.set(targetBlockKey, newTargetBlock)
  }

  return newBlockMap
}