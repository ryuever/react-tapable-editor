import removeBlock from './removeBlock'
import { List, OrderedMap } from 'immutable'
import resetSibling from './resetSibling'
import contains from './contains'

/**
 * 1. remove childBlock first
 * 2. update block data
 */

export default (blockMap, parentBlockKey, childBlockKey) => {
  const childBlock = blockMap.get(childBlockKey)

  const blockMapAfterRemove = removeBlock(blockMap, childBlockKey)
  const childGroup = new OrderedMap()

  const blockMapAfterRemoveChildGroup = blockMapAfterRemove.toSeq().filter(block => {
    const blockKey = block.getKey()
    const falsy = contains(blockMapAfterRemove, childBlockKey, blockKey)
    if (!falsy) return true
    childGroup.set(blockKey, block)
    return false
  })

  // parentBlock需要调用`blockMapAfterRemove`,因为它的`sibling`有可能变化了
  const parentBlock = blockMapAfterRemoveChildGroup.get(parentBlockKey)
  const childBlockAfterRemove = resetSibling(childBlock)

  const blocksBeforeParent = blockMapAfterRemoveChildGroup.toSeq().takeUntil(block => {
    return block.getKey() === parentBlockKey;
  });

  const parentGroup = blockMapAfterRemoveChildGroup.toSeq().skipUntil(function (block) {
    return block.getKey() === parentBlockKey;
  }).takeUntil((_, blockKey) => {
    const falsy = contains(blockMapAfterRemoveChildGroup, parentBlockKey, blockKey)

    if (falsy) {
      console.log('contains ', parentBlockKey, blockKey)
    }

    return !falsy
  })

  const parentGroupRest = blockMapAfterRemoveChildGroup.toSeq().reverse().takeUntil((_, blockKey) => {
    return contains(blockMapAfterRemoveChildGroup, parentBlockKey, blockKey)
  }).reverse()

  console.log('child group : ',
    childGroup.toArray(),
    blocksBeforeParent.toArray(),
    parentGroup.toArray(),
    parentGroupRest.toArray()
  )

  let newBlockMap = blocksBeforeParent.concat(
    [
      [ parentBlockKey, parentBlock]
    ],
    parentGroup,
    [
      [childBlockKey, childBlock],
    ],
    childGroup,
    parentGroupRest,
  ).toOrderedMap();

  console.log('new block map ', newBlockMap.toArray())

  const childKeys = parentBlock.getChildKeys()
  const childKeysArray = childKeys.toArray()
  const len = childKeysArray.length
  let lastChildBlockKey

  if (len) {
    lastChildBlockKey = childKeysArray[len - 1]
  }

  childKeysArray.push(childBlockKey)
  const newParentBlock = parentBlock.merge({
    children: List(childKeysArray),
  })

  newBlockMap = newBlockMap.set(parentBlockKey, newParentBlock)

  if (lastChildBlockKey) {
    const lastChildBlock = newBlockMap.get(lastChildBlockKey)
    const newLastChildBlock = lastChildBlock.merge({
      nextSibling: childBlockKey
    })
    newBlockMap = newBlockMap.set(lastChildBlockKey, newLastChildBlock)

    const newChildBlock = childBlockAfterRemove.merge({
      prevSibling: lastChildBlockKey,
      parent: parentBlockKey,
      nextSibling: null,
    })
    newBlockMap = newBlockMap.set(childBlockKey, newChildBlock)
  } else {
    const newChildBlock = childBlockAfterRemove.merge({
      prevSibling: null,
      parent: parentBlockKey,
      nextSibling: null,
    })
    newBlockMap = newBlockMap.set(childBlockKey, newChildBlock)
  }

  return newBlockMap
}