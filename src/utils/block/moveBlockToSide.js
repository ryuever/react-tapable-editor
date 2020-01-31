import removeBlock from './removeBlock'
import appendChildBlock from './appendChildBlock'
import moveBlockBefore from './moveBlockBefore'

export default (
  blockMap,
  sourceBlock,
  targetBlock,
  position
) => {
  const parentKey = targetBlock.parent;
  const parentBlock = blockMap.get(parentKey)

  // 首先查看parentNode是否包含`isFlexRow` data
  const isFlexRow = parentBlock.getData.get('flexRow')
  let newBlockMap = blockMapAfterRemove

  if (!isFlexRow) {
    const emptyBlock = createEmptyBlock()
    const flexBlock = emptyBlock.merge({
      data: emptyBlock.getData().merge({
        flexRow: true,
        getChildKeys: [],
      })
    })
    newBlockMap = moveBlockBefore(newBlockMap, flexBlock, targetBlock)
    newBlockMap = removeBlock(newBlockMap, targetBlock)

    if (position === 'left') {
      newBlockMap = appendChildBlock(newBlockMap, flexBlock, sourceBlock)
      newBlockMap = appendChildBlock(newBlockMap, flexBlock, targetBlock)
    } else {
      newBlockMap = appendChildBlock(newBlockMap, flexBlock, targetBlock)
      newBlockMap = appendChildBlock(newBlockMap, flexBlock, sourceBlock)
    }
  } else {
    newBlockMap = appendChildBlock(newBlockMap, parentBlock, sourceBlock)
  }

  return newBlockMap
}