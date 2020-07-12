import {
  BlockNodeMap,
  ContentBlockNode,
  TransformBlockCallback,
} from '../../types';

const BlockMutationUtil = {
  // moveBlockInContentState
  // removeRangeFromContentState.js
  transformBlock: function transformBlock(
    key: string | null,
    blockMap: BlockNodeMap,
    func: TransformBlockCallback
  ) {
    if (!key) {
      return;
    }

    const block = blockMap.get(key);

    if (!block) {
      return;
    }

    blockMap.set(key, func(block));
  },

  deleteFromChildrenList: function deleteFromChildrenList(
    block: ContentBlockNode,
    originalBlockKey: string
  ) {
    const parentChildrenList = block.getChildKeys();
    return block.merge({
      children: parentChildrenList.delete(
        parentChildrenList.indexOf(originalBlockKey)
      ),
    });
  },
};

export default BlockMutationUtil;
