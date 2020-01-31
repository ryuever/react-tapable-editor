import appendChildBlock from './appendChildBlock'

/**
 * 1. remove childBlock first
 * 2. update block data
 */

export default (blockMap, parentBlock, childBlock) => {
  let newBlockMap = appendChildBlock(blockMap, parentBlock, childBlock)
  const childKeys = parentBlock.getChildKeys()
  const childKeysArray = childKeys.toArray()
  const len = childKeysArray.length

  for (let i = 0; i < len; i++) {
    const key = childKeysArray[i]
    const block = newBlockMap.get(key)
    const newBlock = block.getData().merge({
      'flexRowChild': true,
      'flexRowTotalCount': len,
      'flexRowIndex': i
    })
    newBlockMap = newBlockMap.set(key, newBlock)
  }

  return newBlockMap
}