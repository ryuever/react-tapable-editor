import { OrderedMap } from 'immutable';
import findRootNode from './findRootNode';
import { BlockNodeMap, ContentBlockNode } from '../../types';

const flattenBlocks = (
  blockMap: BlockNodeMap,
  startKey: string,
  endKey: string
) => {
  const newBlockMap = blockMap;
  let prefixBlocks = OrderedMap<string, ContentBlockNode>();
  let suffixBlocks = OrderedMap<string, ContentBlockNode>();

  let blocksBefore = newBlockMap
    .toSeq()
    .takeUntil((_, key) => key === startKey)
    .toOrderedMap();

  let blocksBeforeLast = blocksBefore.toSeq().last() as ContentBlockNode;
  if (blocksBeforeLast) {
    blocksBeforeLast = findRootNode(blockMap, blocksBeforeLast.getKey())!;
    prefixBlocks = prefixBlocks.set(
      blocksBeforeLast.getKey(),
      blocksBeforeLast
    );
  }

  let blocksAfter = newBlockMap
    .toSeq()
    .skipUntil((_, key) => key === endKey)
    .skip(1)
    .takeWhile(() => true)
    .toOrderedMap(); // take all after key
  const blocksAfterFirst = blocksAfter.toSeq().first<ContentBlockNode>();

  if (blocksAfterFirst) {
    suffixBlocks = suffixBlocks.set(
      blocksAfterFirst.getKey(),
      blocksAfterFirst
    );
  }

  // TODO -----------------pending
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
    .toOrderedMap()
    .toSeq()
    .reduce<BlockNodeMap>((orderMap: BlockNodeMap, currentBlock: any) => {
      const last = orderMap.toSeq().last<ContentBlockNode>();
      const currentBlockKey = currentBlock!.getKey();
      if (last) {
        const lastBlockKey = last.getKey();
        const lastBlock = orderMap.get(lastBlockKey);
        const newLastBlock = lastBlock!.merge({ nextSibling: currentBlockKey });
        orderMap = orderMap.set(lastBlockKey, newLastBlock);
        const newCurrentBlock = currentBlock!.merge({
          prevSibling: lastBlockKey,
        });
        orderMap = orderMap.set(currentBlockKey, newCurrentBlock);
      } else if (currentBlock) {
        orderMap = orderMap.set(currentBlockKey, currentBlock);
      }
      return orderMap;
    }, OrderedMap());

  if (blocksBeforeLast) {
    const prefixBlock = blocks.toSeq().first<ContentBlockNode>();
    blocks = blocks.skip(1);
    const key = prefixBlock.getKey();
    blocksBefore = blocksBefore.toOrderedMap().set(key, prefixBlock);
  }

  if (blocksAfterFirst) {
    const suffixBlock = blocks.toSeq().last<ContentBlockNode>();
    const suffixBlockKey = suffixBlock.getKey();

    blocks = blocks
      .toSeq()
      .takeUntil((_, key) => key === suffixBlockKey)
      .toOrderedMap();
    blocksAfter = blocksAfter.toOrderedMap().set(suffixBlockKey, suffixBlock);
  }

  return blocksBefore.concat(blocks, blocksAfter).toOrderedMap();
};

export default flattenBlocks;
