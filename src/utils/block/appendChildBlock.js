import removeBlock from './removeBlock'
import { List } from 'immutable'

/**
 * 1. remove childBlock first
 * 2. update block data
 */

export default (blockMap, parentBlock, childBlock) => {
  const blockMapAfterRemove = removeBlock(blockMap, childBlock)
  const parentBlockKey = parentBlock.getKey()
  const childBlockKey = childBlock.getKey()
  const childKeys = parentBlock.getChildKeys()
  const childKeysArray = childKeys.toArray()
  const len = childKeysArray.length

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

  return newBlockMap.set(parentBlockKey, newParentBlock)
}