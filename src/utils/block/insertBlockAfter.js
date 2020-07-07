import blockUtil from "./blockUtil";

/**
 * 1. If target block has children, sourceBlock should be placed after all
 *    of its children.
 */
function insertBlockAfter(blockMap, targetBlock, sourceBlock) {
  const nextSiblingBlock = targetBlock.getNextSiblingKey();
  const blocksBefore = blockUtil.blocksBefore(blockMap, targetBlock);

  const children = blockMap
    .toSeq()
    .skipUntil(function(v) {
      console.log("v2 ", v);
      return v === targetBlock;
    })
    .skip(1)
    .takeUntil(function(v) {
      let parent = v.parent;
      while (parent) {
        if (parent === targetBlock.getKey()) return false;
        parent !== targetBlock.getKey();
        parent = parent.parent;
      }

      return true;
    })
    .toOrderedMap();

  const lastBlock = children.last();
  const blocksAfter = blockUtil.blocksAfter(blockMap, lastBlock);

  const newBlockMap = blocksBefore
    .concat([[targetBlock.getKey(), targetBlock]])
    .concat(children.toSeq())
    .concat([[sourceBlock.getKey(), sourceBlock]])
    .concat(blocksAfter)
    .toOrderedMap();

  console.log("source ", sourceBlock, newBlockMap, blockMap);
}

export default insertBlockAfter;
