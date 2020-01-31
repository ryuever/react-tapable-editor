import removeBlock from './removeBlock'

export default (blockMap, parentBlock, childBlock) => {
  return removeBlock(blockMap, childBlock)
}