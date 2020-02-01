import appendChildBlock from './appendChildBlock'
import appendFlexChildBlock from './appendFlexChildBlock'
import addBlockBefore from './addBlockBefore'
import addBlockAfter from './addBlockAfter'
import moveBlockBefore from './moveBlockBefore'
import moveBlockAfter from './moveBlockAfter'
import createEmptyBlockNode from './createEmptyBlockNode'
import resetSibling from './resetSibling'
import findRootNodeSibling from './findRootNodeSibling'

export default (
  blockMap,
  sourceBlockKey,
  targetBlockKey,
  position
) => {
  try {
    const sourceBlock = blockMap.get(sourceBlockKey)
    const targetBlock = blockMap.get(targetBlockKey)
    const parentKey = targetBlock.parent;
    const parentBlock = blockMap.get(parentKey)

    const sourceNextSibling = sourceBlock.getNextSiblingKey()

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

      if (position === 'left') {
        const targetWrapperBlock = createEmptyBlockNode()
        const targetWrapperBlockKey = targetWrapperBlock.getKey()
        newBlockMap = addBlockBefore(newBlockMap, targetWrapperBlock, targetBlockKey)
        console.log('new block 1 ', newBlockMap)

        newBlockMap = appendChildBlock(newBlockMap, targetWrapperBlockKey, targetBlockKey)
        console.log('new block 2 ', newBlockMap)

        // 首先将sourceBlock放置到左边
        newBlockMap = moveBlockBefore(newBlockMap, sourceBlockKey, targetWrapperBlockKey)
        console.log('new block 3', newBlockMap)

        const sourceWrapperBlock = createEmptyBlockNode()
        const sourceWrapperBlockKey = sourceWrapperBlock.getKey()
        newBlockMap = addBlockBefore(newBlockMap, sourceWrapperBlock, sourceBlockKey)

        console.log('new block 4', newBlockMap)

        newBlockMap = appendChildBlock(newBlockMap, sourceWrapperBlockKey, sourceBlockKey)
        console.log('new block 5', newBlockMap)

        newBlockMap = addBlockBefore(newBlockMap, flexBlock, sourceWrapperBlockKey)
        console.log('new block 6', newBlockMap)

        newBlockMap = appendFlexChildBlock(newBlockMap, flexBlockKey, sourceWrapperBlockKey)
        console.log('new block 7', newBlockMap)

        newBlockMap = appendFlexChildBlock(newBlockMap, flexBlockKey, targetWrapperBlockKey)
        console.log('new block 8', newBlockMap)

        const nextSibling = findRootNodeSibling(newBlockMap, flexBlockKey)
        // console.log('next ', nextSibling)

        // // 找到从flexBlock开始，第一个parent不存在的
        const nextFlexBlock = newBlockMap.get(flexBlockKey)
        const newFlexBlock = nextFlexBlock.merge({
          nextSibling: nextSibling
        })

        // console.log('next ', newFlexBlock, newBlockMap)

        newBlockMap = newBlockMap.set(flexBlockKey, newFlexBlock)

        console.log('flex block key', flexBlockKey)
        console.log('source : ', sourceWrapperBlockKey, sourceBlockKey)
        console.log('target : ', targetWrapperBlockKey, targetBlockKey)

        console.log('new ', newBlockMap)
      }

      if (position === 'right') {
        const targetWrapperBlock = createEmptyBlockNode()
        const targetWrapperBlockKey = targetWrapperBlock.getKey()
        newBlockMap = addBlockBefore(newBlockMap, targetWrapperBlock, targetBlockKey)
        console.log('new block 1 ', newBlockMap)

        newBlockMap = appendChildBlock(newBlockMap, targetWrapperBlockKey, targetBlockKey)
        console.log('new block 2 ', newBlockMap)

        // 首先将sourceBlock放置到左边
        newBlockMap = moveBlockAfter(newBlockMap, sourceBlockKey, targetWrapperBlockKey)
        console.log('new block 3', newBlockMap)

        const sourceWrapperBlock = createEmptyBlockNode()
        const sourceWrapperBlockKey = sourceWrapperBlock.getKey()
        newBlockMap = addBlockBefore(newBlockMap, sourceWrapperBlock, sourceBlockKey)

        console.log('new block 4', newBlockMap)


        newBlockMap = appendChildBlock(newBlockMap, sourceWrapperBlockKey, sourceBlockKey)
        console.log('new block 5', newBlockMap)

        newBlockMap = addBlockBefore(newBlockMap, flexBlock, targetWrapperBlockKey)
        console.log('new block 6', newBlockMap)

        newBlockMap = appendFlexChildBlock(newBlockMap, flexBlockKey, targetWrapperBlockKey)
        console.log('new block 7', newBlockMap)

        newBlockMap = appendFlexChildBlock(newBlockMap, flexBlockKey, sourceWrapperBlockKey)
        console.log('new block 8', newBlockMap)

        const nextSibling = findRootNodeSibling(newBlockMap, flexBlockKey)

        // 找到从flexBlock开始，第一个parent不存在的
        const nextFlexBlock = newBlockMap.get(flexBlockKey)
        const newFlexBlock = nextFlexBlock.merge({
          nextSibling: nextSibling
        })

        newBlockMap = newBlockMap.set(flexBlockKey, newFlexBlock)
      }
    } else {
      newBlockMap = appendChildBlock(newBlockMap, parentKey, sourceBlockKey)
    }

    console.log('finial block map : ', newBlockMap)

    return newBlockMap
  } catch (err) {
    console.log('`moveBlockToSide` ', err)
  }
}