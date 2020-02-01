import removeBlock from './removeBlock'
import { List, OrderedMap } from 'immutable'
import resetSibling from './resetSibling'
import contains from './contains'

export default (blockMap, parentBlockKey, childBlockKey) => {
  const childBlock = blockMap.get(childBlockKey)

  // 首先需要将block sibling给去掉；否则它会影响最终的sibling依赖
  const childBlockAfterRemove = resetSibling(childBlock)

  const blockMapAfterRemove = removeBlock(blockMap, childBlockKey)

  const blockMapAfterRemoveChildGroup = blockMapAfterRemove
    .toSeq()
    .filter((_, blockKey) => !contains(blockMap, childBlockKey, blockKey))

  const childGroup = blockMapAfterRemove
    .toSeq()
    .filter((block, blockKey) => contains(blockMap, childBlockKey, blockKey))

  // parentBlock需要调用`blockMapAfterRemove`,因为它的`sibling`有可能变化了
  const parentBlock = blockMapAfterRemoveChildGroup.get(parentBlockKey)
  // const childBlockAfterRemove = resetSibling(childBlock)

  const blocksBeforeParent = blockMapAfterRemoveChildGroup
    .toSeq()
    .takeUntil(block => block.getKey() === parentBlockKey)

  const parentGroup = blockMapAfterRemoveChildGroup
    .toSeq()
    .skipUntil(block => block.getKey() === parentBlockKey)
    .takeUntil((_, blockKey) => !contains(
      blockMapAfterRemoveChildGroup,
      parentBlockKey,
      blockKey
    ))

  const parentGroupRest = blockMapAfterRemoveChildGroup
    .toSeq()
    .reverse()
    .takeUntil((_, blockKey) => contains(
      blockMapAfterRemoveChildGroup,
      parentBlockKey,
      blockKey
    )).reverse()

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
      [childBlockKey, childBlockAfterRemove],
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

  const next = newBlockMap.get(childBlockKey)
  const nextChildKeys = next.getChildKeys().toArray()
  const nextLen = nextChildKeys.length

  if (nextLen) {
    const childFirstBlockKey = nextChildKeys[0]
    const childFirstBlock = newBlockMap.get(childFirstBlockKey)
    const childLastBlockKey = nextChildKeys[nextLen - 1]
    const childLastBlock = newBlockMap.get(childLastBlockKey)

    console.log('child ', childFirstBlockKey, childFirstBlock)

    {
      const prevSiblingKey = childFirstBlock.getPrevSiblingKey()
      if (prevSiblingKey) {
        const prevSiblingBlock = newBlockMap.get(prevSiblingKey).merge({
          nextSibling: null,
        })
        newBlockMap = newBlockMap.set(prevSiblingKey, prevSiblingBlock)

        newBlockMap = newBlockMap.set(childFirstBlockKey, childFirstBlock.merge({
          prevSibling: null,
        }))
      }
    }

    {
      const nextSiblingKey = childFirstBlock.getNextSiblingKey()
      if (nextSiblingKey) {
        const nextSiblingBlock = newBlockMap.get(nextSiblingKey).merge({
          prevSibling: null,
        })
        newBlockMap = newBlockMap.set(nextSiblingKey, nextSiblingBlock)

        newBlockMap = newBlockMap.set(childLastBlockKey, childLastBlock.merge({
          nextSibling: null,
        }))
      }
    }
  }

  return newBlockMap
}