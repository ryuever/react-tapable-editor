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
    [targetBlockKey, targetBlock],
    [sourceBlockKey, sourceBlock],
  ], blocksAfter).toOrderedMap();

  const parentKey = targetBlock.parent;
  const parentBlock = blockMapAfterRemove.get(parentKey)

  if (parentBlock) {
    // adjust parent children
    const childKeys = parentBlock.getChildKeys()
    const insertionIndex = childKeys.indexOf(targetBlockKey) + 1
    const childKeysArray = childKeys.toArray()
    childKeysArray.splice(insertionIndex, 0, sourceBlockKey)

    const newParentBlock = parentBlock.merge({
      children: List(childKeysArray),
    })

    newBlockMap = newBlockMap.set(parentKey, newParentBlock)
  }

  const nextSiblingKey = targetBlock.getNextSiblingKey()

  if (nextSiblingKey) {
    const nextSiblingBlock = newBlockMap.get(nextSiblingKey)
    const newNextSiblingBlock = nextSiblingBlock.merge({
      prevSibling: sourceBlockKey
    })
    newBlockMap = newBlockMap.set(nextSiblingKey, newNextSiblingBlock)
  }

  {
    const newSourceBlock = sourceBlock.merge({
      prevSibling: targetBlockKey,
      nextSibling: nextSiblingKey
    })
    newBlockMap = newBlockMap.set(sourceBlockKey, newSourceBlock)
  }

  {
    const newTargetBlock = targetBlock.merge({
      nextSibling: sourceBlockKey,
    })
    newBlockMap = newBlockMap.set(targetBlockKey, newTargetBlock)
  }

  return newBlockMap
}