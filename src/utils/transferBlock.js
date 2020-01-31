import { List } from "immutable"

/**
 *
 * @param {*} editorState
 * @param {String} sourceBlockKey
 * @param {String} targetBlockKey
 * @param {String} position : one of values ['top', 'right', 'bottom', 'left']
 */

const removeBlock = (currentContent, blockKey) => {
  const blockMap = currentContent.getBlockMap()
  const blockToRemove = blockMap.get(blockKey)
  if (!blockToRemove) return

  const blocksBefore = blockMap.toSeq().takeUntil(function (v) {
    return v === blockToRemove;
  });
  const blocksAfter = blockMap.toSeq().skipUntil(function (v) {
    return v === blockToRemove;
  }).rest();

  let newBlockMap = blocksBefore.concat(blocksAfter).toOrderedMap();

  const parentKey = blockToRemove.parent;
  const parentBlock = blockMap.get(parentKey)

  if (parentBlock) {
    // adjust parent children
    const childKeys = parentBlock.getChildKeys()
    const removeIndex = childKeys.indexOf(blockKey)
    const childKeysArray = childKeys.toArray()
    childKeysArray.splice(removeIndex, 1)

    const newParentBlock = parentBlock.merge({
      children: List(childKeysArray),
    })

    newBlockMap = newBlockMap.set(parentKey, newParentBlock)
  }

  const prevSiblingKey = blockToRemove.getPrevSiblingKey()
  const nextSiblingKey = blockToRemove.getNextSiblingKey()

  if (prevSiblingKey) {
    const prevSiblingBlock = newBlockMap.get(prevSiblingKey)
    const newPrevSiblingBlock = prevSiblingBlock.merge({
      nextSibling: nextSiblingKey
    })
    newBlockMap = newBlockMap.set({
      prevSiblingKey: newPrevSiblingBlock
    })
  }
  if (nextSiblingKey) {
    const nextSiblingBlock = newBlockMap.get(nextSiblingKey)
    const newNextSiblingBlock = nextSiblingBlock.merge({
      prevSibling: prevSiblingKey
    })

    newBlockMap = newBlockMap.set({
      nextSiblingKey: newNextSiblingBlock
    })
  }

  return currentContent.merge({
    blockMap: newBlockMap,
  })
}

const transferBlockToPosition = (currentContent, blockToRemove, targetBlockKey, position) => {
  const blockMap = currentContent.getBlockMap()
  const blockToOperate = blockMap.get(targetBlockKey)
  const newBlockKey = blockToRemove.getKey()
  if (!blockToOperate) return

  const blocksBefore = blockMap.toSeq().takeUntil(function (v) {
    return v === blockToOperate;
  });
  const blocksAfter = blockMap.toSeq().skipUntil(function (v) {
    return v === blockToOperate;
  }).rest();

  let newBlockMap = blocksBefore.concat([
    [newBlockKey, blockToRemove],
  ], blocksAfter).toOrderedMap();

  const parentKey = blockToOperate.parent;
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

  const prevSiblingKey = blockToRemove.getPrevSiblingKey()
  const nextSiblingKey = blockToRemove.getNextSiblingKey()

  if (prevSiblingKey) {
    const prevSiblingBlock = newBlockMap.get(prevSiblingKey)
    const newPrevSiblingBlock = prevSiblingBlock.merge({
      nextSibling: newBlockKey
    })
    newBlockMap = newBlockMap.set({
      prevSiblingKey: newPrevSiblingBlock
    })
  }

  {
    const newBlockToRemove = blockToRemove.merge({
      prevSibling: prevSiblingKey,
      nextSibling: targetBlockKey
    })
    newBlockMap = newBlockMap.set({
      newBlockKey: newBlockToRemove,
    })
  }

  {
    const newBlockToOperate = blockToOperate.merge({
      prevSibling: newBlockKey,
    })
    newBlockMap = newBlockMap.set({
      targetBlockKey: newBlockToOperate,
    })
  }

  return {
    newContent: currentContent.merge({
      blockMap: newBlockMap,
    }),
  }
}

const transferBlock = (editorState, sourceBlockKey, targetBlockKey, position = 'top') => {
  let currentContent = editorState.getCurrentContent()
  const blockMap = currentContent.getBlockMap()
  const sourceBlock = blockMap.get(sourceBlockKey)
  const targetBlock = blockMap.get(targetBlockKey)

  if (!sourceBlock || !targetBlock) return
  const contentAfterRemove = removeBlock(currentContent, sourceBlockKey)
  if (!contentAfterRemove) return

  currentContent = contentAfterRemove.newContent
  const blockToRemove = contentAfterRemove.blockToRemove

  const contentAfterAdd = transferBlockToPosition(currentContent, blockToRemove, targetBlockKey, position)

  return contentAfterAdd.newContent
}

export default transferBlock