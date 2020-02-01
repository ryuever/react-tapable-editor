import removeBlock from './removeBlock'
import appendChildBlock from './appendChildBlock'
import moveBlockBefore from './moveBlockBefore'
import createEmptyBlockNode from './createEmptyBlockNode'

export default (
  blockMap,
  sourceBlock,
  targetBlock,
  position
) => {
  try {
    const parentKey = targetBlock.parent;
    const parentBlock = blockMap.get(parentKey)
    const targetBlockKey = targetBlock.getKey()
    const sourceBlockKey = sourceBlock.getKey()

    // 首先查看parentNode是否包含`isFlexRow` data
    // const isFlexRow = parentBlock.getData().get('flexRow')
    let newBlockMap = blockMap
    let flexBlockKey
    let nextKey = sourceBlock.getNextSiblingKey()

    if (!parentBlock) {
      const emptyBlock = createEmptyBlockNode()
      const flexBlock = emptyBlock.merge({
        data: emptyBlock.getData().merge({
          flexRow: true,
          getChildKeys: [],
        })
      })
      flexBlockKey = flexBlock.getKey()
      newBlockMap = moveBlockBefore(newBlockMap, flexBlock, targetBlock)
      const nextSiblingKey = targetBlock.getNextSiblingKey()

      const nextSiblingBlock = newBlockMap.get(nextSiblingKey)
      const newNextSiblingBlock = nextSiblingBlock.merge({
        prevSibling: flexBlockKey
      })
      newBlockMap = newBlockMap.set(nextSiblingKey, newNextSiblingBlock)

      if (position === 'left') {
        newBlockMap = appendChildBlock(newBlockMap, flexBlockKey, sourceBlockKey)
        newBlockMap = appendChildBlock(newBlockMap, flexBlockKey, targetBlockKey)
      } else {
        newBlockMap = appendChildBlock(newBlockMap, flexBlockKey, targetBlockKey)
        newBlockMap = appendChildBlock(newBlockMap, flexBlockKey, sourceBlockKey)
      }
    } else {
      newBlockMap = appendChildBlock(newBlockMap, parentKey, sourceBlockKey)
    }

    const next = newBlockMap.get(flexBlockKey)

    const nextFlexBlock = next.merge({
      nextSibling: nextKey,
    })
    newBlockMap = newBlockMap.set(flexBlockKey, nextFlexBlock)

    return newBlockMap
  } catch (err) {
    console.log('`moveBlockToSide` ', err)
  }
}