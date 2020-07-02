const BlockMutationUtil = {
  // moveBlockInContentState
  // removeRangeFromContentState.js
  transformBlock: function transformBlock(key, blockMap, func) {
    if (!key) {
      return;
    }

    var block = blockMap.get(key);

    if (!block) {
      return;
    }

    blockMap.set(key, func(block));
  },

  deleteFromChildrenList: function deleteFromChildrenList(
    block,
    originalBlockKey
  ) {
    const parentChildrenList = block.getChildKeys();
    return block.merge({
      children: parentChildrenList["delete"](
        parentChildrenList.indexOf(originalBlockKey)
      )
    });
  }
};

export default BlockMutationUtil;
