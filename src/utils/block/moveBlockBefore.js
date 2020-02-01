import removeBlock from './removeBlock'
import resetSibling from './resetSibling'

export default (
  blockMap,
  sourceBlockKey,
  targetBlockKey,
) => {
  const sourceBlock = blockMap.get(sourceBlockKey)
  const t = blockMap.get(targetBlockKey)

  // 如果说source本来就在target前面的话，就不需要处理了
  if (t.getPrevSiblingKey() === sourceBlockKey) return blockMap

  const blockMapAfterRemove = removeBlock(blockMap, sourceBlockKey)
  const targetBlock = blockMap.get(targetBlockKey)
  const sourceBlockAfterRemove = resetSibling(sourceBlock)


  if (!blockMapAfterRemove) return

  if (!targetBlock) return

  const blocksBefore = blockMapAfterRemove.toSeq().takeUntil(function (v) {
    return v.getKey() === targetBlockKey;
  });
  const blocksAfter = blockMapAfterRemove.toSeq().skipUntil(function (v) {
    return v.getKey() === targetBlockKey;
  }).rest();

  let newBlockMap = blocksBefore.concat([
    [sourceBlockKey, sourceBlockAfterRemove],
    [targetBlockKey, targetBlock],
  ], blocksAfter).toOrderedMap();


  console.log('move block before : ', blocksBefore.toArray(), blocksAfter.toArray(), newBlockMap, blockMapAfterRemove)

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
    const newSourceBlock = sourceBlockAfterRemove.merge({
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