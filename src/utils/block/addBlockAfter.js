import { List } from "immutable";

export default (blockMap, newBlock, targetBlockKey) => {
  const newBlockKey = newBlock.getKey();
  const targetBlock = blockMap.get(targetBlockKey);
  if (!targetBlock) return;

  const blocksBefore = blockMap.toSeq().takeUntil(function(v) {
    return v === targetBlock;
  });
  const blocksAfter = blockMap
    .toSeq()
    .skipUntil(function(v) {
      return v === targetBlock;
    })
    .rest();

  let newBlockMap = blocksBefore
    .concat(
      [
        [targetBlockKey, targetBlock],
        [newBlockKey, newBlock]
      ],
      blocksAfter
    )
    .toOrderedMap();

  const parentKey = targetBlock.parent;
  const parentBlock = blockMap.get(parentKey);

  if (parentBlock) {
    // adjust parent children
    const childKeys = parentBlock.getChildKeys();
    const insertionIndex = childKeys.indexOf(targetBlockKey) + 1;
    const childKeysArray = childKeys.toArray();
    childKeysArray.splice(insertionIndex, 0, newBlockKey);

    const newParentBlock = parentBlock.merge({
      children: List(childKeysArray)
    });

    newBlockMap = newBlockMap.set(parentKey, newParentBlock);
  }

  const nextSiblingKey = targetBlock.getNextSiblingKey();

  if (nextSiblingKey) {
    const nextSiblingBlock = newBlockMap.get(nextSiblingKey);
    const newNextSiblingBlock = nextSiblingBlock.merge({
      prevSibling: newBlockKey
    });
    newBlockMap = newBlockMap.set(nextSiblingKey, newNextSiblingBlock);
  }

  {
    const nextNewBlock = newBlock.merge({
      prevSibling: targetBlockKey,
      nextSibling: nextSiblingKey
    });
    newBlockMap = newBlockMap.set(newBlockKey, nextNewBlock);
  }

  {
    const newTargetBlock = targetBlock.merge({
      nextSibling: newBlockKey
    });
    newBlockMap = newBlockMap.set(targetBlockKey, newTargetBlock);
  }

  return newBlockMap;
};
