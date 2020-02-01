import removeChildBlock from './removeChildBlock'

export default (blockMap, parentBlockKey, childBlockKey) => {
  return removeChildBlock(blockMap, parentBlockKey, childBlockKey)
}