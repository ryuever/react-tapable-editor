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
  const parentKey = targetBlock.parent;
  const parentBlock = blockMap.get(parentKey)
  const targetBlockKey = targetBlock.getKey()
  const sourceBlockKey = sourceBlock.getKey()

  // 首先查看parentNode是否包含`isFlexRow` data
  // const isFlexRow = parentBlock.getData().get('flexRow')
  let newBlockMap = blockMap
  let flexBlockKey
  let nextKey = sourceBlock.getNextSiblingKey()
  console.log('x ', nextKey)

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

    // console.log('new block 1 ', newBlockMap, targetBlock, flexBlock)

    console.log('key : ', flexBlock.getKey(), targetBlock.getKey(), sourceBlock.getKey())

    // console.log('new block ', newBlockMap, targetBlock, flexBlock)

    if (position === 'left') {
      newBlockMap = appendChildBlock(newBlockMap, flexBlockKey, sourceBlockKey)
      newBlockMap = appendChildBlock(newBlockMap, flexBlockKey, targetBlockKey)
    } else {
      newBlockMap = appendChildBlock(newBlockMap, flexBlockKey, targetBlockKey)
      console.log('nwe block --- ', newBlockMap)
      newBlockMap = appendChildBlock(newBlockMap, flexBlockKey, sourceBlockKey)
      console.log('nwe block 2 --- ', newBlockMap)
    }
  } else {
    newBlockMap = appendChildBlock(newBlockMap, parentBlock, sourceBlock)
  }

  console.log('xxx')

  const next = newBlockMap.get(flexBlockKey)
  console.log('next : ', next)

  try {
    const nextFlexBlock = next.merge({
      nextSibling: nextKey,
    })
    newBlockMap = newBlockMap.set(flexBlockKey, nextFlexBlock)

    console.log('new block 3 ', newBlockMap)
  } catch(err) {
    console.log('err', err)
  }

  return newBlockMap
}