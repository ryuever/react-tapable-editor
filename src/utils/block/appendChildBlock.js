import removeBlock from './removeBlock'
import { List } from 'immutable'

/**
 * 1. remove childBlock first
 * 2. update block data
 */

export default (blockMap, parentBlockKey, childBlockKey) => {
  const parentBlock = blockMap.get(parentBlockKey)
  const childBlock = blockMap.get(childBlockKey)
  const blockMapAfterRemove = removeBlock(blockMap, childBlock)

  console.log('block after remove : ', blockMapAfterRemove)
  const childKeys = parentBlock.getChildKeys()
  const childKeysArray = childKeys.toArray()
  const len = childKeysArray.length
  let lastChildBlockKey

  if (len) {
    lastChildBlockKey = childKeysArray[len - 1]
  }

  const queryKey = len ? childKeysArray[len - 1] : parentBlockKey

  const blocksBefore = blockMapAfterRemove.toSeq().takeUntil(function (block) {
    return block.getKey() === queryKey;
  });
  const blocksAfter = blockMapAfterRemove.toSeq().skipUntil(function (block) {
    return block.getKey() === queryKey;
  }).rest();

  const queryBlock = blockMapAfterRemove.get(queryKey)

  let newBlockMap = blocksBefore.concat([
    [queryKey, queryBlock],
    [childBlockKey, childBlock],
  ], blocksAfter).toOrderedMap();

  childKeysArray.push(childBlockKey)
  const newParentBlock = parentBlock.merge({
    children: List(childKeysArray),
  })

  newBlockMap = newBlockMap.set(parentBlockKey, newParentBlock)

  if (lastChildBlockKey) {
    const lastChildBlock = blockMapAfterRemove.get(lastChildBlockKey)
    const newLastChildBlock = lastChildBlock.merge({
      nextSibling: childBlockKey
    })
    newBlockMap = newBlockMap.set(lastChildBlockKey, newLastChildBlock)

    const newChildBlock = childBlock.merge({
      prevSibling: lastChildBlockKey,
      parent: parentBlockKey,
      nextSibling: null,
    })
    newBlockMap = newBlockMap.set(childBlockKey, newChildBlock)
  } else {
    const newChildBlock = childBlock.merge({
      prevSibling: null,
      parent: parentBlockKey,
      nextSibling: null,
    })
    newBlockMap = newBlockMap.set(childBlockKey, newChildBlock)
  }

  return newBlockMap
}