import moveBlockBefore from './moveBlockBefore'
import moveBlockToSide from './moveBlockToSide'

const transferBlock = (
  editorState,
  sourceBlockKey,
  targetBlockKey,
  position = 'top'
) => {
  let currentContent = editorState.getCurrentContent()
  const blockMap = currentContent.getBlockMap()
  const sourceBlock = blockMap.get(sourceBlockKey)
  const targetBlock = blockMap.get(targetBlockKey)

  if (!sourceBlock || !targetBlock) return
  let newBlockMap

  switch (position) {
    case 'top':
      newBlockMap = moveBlockBefore(blockMap, sourceBlock, targetBlock)
      break;
    case 'left':
      newBlockMap = moveBlockToSide(blockMap, sourceBlock, targetBlock, 'left')
      break;
    case 'right':
      newBlockMap = moveBlockToSide(blockMap, sourceBlock, targetBlock, 'right')
    default:
      // ...
  }

  return currentContent.merge({
    blockMap: newBlockMap,
  })
}

export default transferBlock