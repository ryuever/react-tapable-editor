import appendChildBlock from "./appendChildBlock";

/**
 * 1. remove childBlock first
 * 2. update block data
 */

export default (blockMap, parentBlockKey, childBlockKey) => {
  let newBlockMap = appendChildBlock(blockMap, parentBlockKey, childBlockKey);
  const parentBlock = blockMap.get(parentBlockKey);
  const childKeys = parentBlock.getChildKeys();
  const childKeysArray = childKeys.toArray();
  const len = childKeysArray.length;

  for (let i = 0; i < len; i++) {
    const key = childKeysArray[i];
    const block = newBlockMap.get(key);
    const newBlock = block.merge({
      data: block.getData().merge({
        flexRowChild: true,
        flexRowTotalCount: len,
        flexRowIndex: i
      })
    });
    newBlockMap = newBlockMap.set(key, newBlock);
  }

  return newBlockMap;
};
