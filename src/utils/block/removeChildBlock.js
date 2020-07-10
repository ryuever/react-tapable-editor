import removeBlock from './removeBlock';

export default (blockMap, parentBlockKey, childBlockKey) => {
  return removeBlock(blockMap, childBlockKey);
};
