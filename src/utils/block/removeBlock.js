import { List } from "immutable"

/**
 *
 * @param {*} editorState
 * @param {String} sourceBlockKey
 * @param {String} targetBlockKey
 * @param {String} position : one of values ['top', 'right', 'left']
 */

export default (blockMap, blockToRemove) => {
  const blockKey =blockToRemove.getKey()
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

  console.log('block to remove : ', blockToRemove)

  const prevSiblingKey = blockToRemove.getPrevSiblingKey()
  const nextSiblingKey = blockToRemove.getNextSiblingKey()

  if (prevSiblingKey) {
    const prevSiblingBlock = newBlockMap.get(prevSiblingKey)
    const newPrevSiblingBlock = prevSiblingBlock.merge({
      nextSibling: nextSiblingKey
    })
    newBlockMap = newBlockMap.set(prevSiblingKey, newPrevSiblingBlock)
  }
  if (nextSiblingKey) {
    const nextSiblingBlock = newBlockMap.get(nextSiblingKey)
    const newNextSiblingBlock = nextSiblingBlock.merge({
      prevSibling: prevSiblingKey
    })

    newBlockMap = newBlockMap.set(nextSiblingKey, newNextSiblingBlock)
  }

  return newBlockMap
}