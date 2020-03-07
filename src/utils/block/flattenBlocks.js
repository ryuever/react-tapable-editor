import { OrderedMap } from "immutable";
import findRootNode from "./findRootNode";

const flattenBlocks = (blockMap, startKey, endKey) => {
  const newBlockMap = blockMap;
  let prefixBlocks = new OrderedMap();
  let suffixBlocks = new OrderedMap();

  let blocksBefore = newBlockMap
    .toSeq()
    .takeUntil((_, key) => key === startKey);

  let blocksBeforeLast = blocksBefore.toSeq().last();
  if (blocksBeforeLast) {
    blocksBeforeLast = findRootNode(blockMap, blocksBeforeLast.getKey());
    prefixBlocks = prefixBlocks.set(
      blocksBeforeLast.getKey(),
      blocksBeforeLast
    );
  }

  let blocksAfter = newBlockMap
    .toSeq()
    .skipUntil((_, key) => key === endKey)
    .skip(1)
    .takeWhile((_, k) => true); // take all after key
  const blocksAfterFirst = blocksAfter.toSeq().first();

  if (blocksAfterFirst) {
    suffixBlocks = suffixBlocks.set(
      blocksAfterFirst.getKey(),
      blocksAfterFirst
    );
  }

  let blocks = prefixBlocks
    .toSeq()
    .concat(
      newBlockMap
        .toSeq()
        .skipUntil((_, key) => key === startKey)
        .takeUntil((_, key) => key === endKey)
        .concat([[endKey, newBlockMap.get(endKey)]])
        .concat(suffixBlocks.toSeq())
    )
    .reduce((orderMap, currentBlock) => {
      const last = orderMap.toSeq().last();
      const currentBlockKey = currentBlock.getKey();
      if (last) {
        const lastBlockKey = last.getKey();
        const lastBlock = orderMap.get(lastBlockKey);
        const newLastBlock = lastBlock.merge({ nextSibling: currentBlockKey });
        orderMap = orderMap.set(lastBlockKey, newLastBlock);
        const newCurrentBlock = currentBlock.merge({
          prevSibling: lastBlockKey
        });
        orderMap = orderMap.set(currentBlockKey, newCurrentBlock);
      } else {
        orderMap = orderMap.set(currentBlockKey, currentBlock);
      }
      return orderMap;
    }, new OrderedMap());

  // console.log('flattern ----- ', prefixBlocks.toArray())
  // console.log('flattern ----- ', suffixBlocks.toArray())
  // console.log('flattern ----- ', blocksBefore.toArray())
  // console.log('flattern ----- ', blocks.toArray())
  // console.log('flattern ----- ', blocksAfter.toArray())

  if (blocksBeforeLast) {
    const prefixBlock = blocks.toSeq().first();
    blocks = blocks.skip(1);
    const key = prefixBlock.getKey();
    blocksBefore = blocksBefore.toOrderedMap().set(key, prefixBlock);
  }

  if (blocksAfterFirst) {
    const suffixBlock = blocks.toSeq().last();
    const suffixBlockKey = suffixBlock.getKey();

    blocks = blocks.toSeq().takeUntil((_, key) => key === suffixBlockKey);
    blocksAfter = blocksAfter.toOrderedMap().set(suffixBlockKey, suffixBlock);
  }

  // console.log('final ', blocksBefore, blocks, blocksAfter)

  return blocksBefore.concat(blocks, blocksAfter).toOrderedMap();
};

export default flattenBlocks;
