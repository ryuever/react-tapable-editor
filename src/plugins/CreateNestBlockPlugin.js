// https://github.com/facebook/draft-js/blob/master/src/model/transaction/splitBlockInContentState.js

import generateRandomKey from 'draft-js/lib/generateRandomKey';
import Immutable from 'immutable';
import { EditorState } from 'draft-js';

const { Map, List } = Immutable;

const updateBlockMapLinks = function updateBlockMapLinks(
  blockMap,
  newParentBlock,
  originalBlock,
  belowBlock
) {
  return blockMap.withMutations(function(blocks) {
    const originalBlockKey = originalBlock.getKey();
    const belowBlockKey = belowBlock.getKey(); // update block parent
    const parentBlockKey = newParentBlock.getKey();

    const originalParentBlockKey = originalBlock.getParentKey();
    const originalParentBlock = blockMap.get(originalParentBlockKey);

    const parentChildrenList = originalParentBlock.getChildKeys();
    const insertionIndex = parentChildrenList.indexOf(originalBlockKey);
    const newChildrenArray = parentChildrenList.toArray();

    newChildrenArray.splice(insertionIndex, 1);
    newChildrenArray.splice(insertionIndex, 0, parentBlockKey);

    const nextOriginalParentBlock = originalParentBlock.merge({
      children: List(newChildrenArray),
    });

    const originalBlockSibling = {
      prevSibling: originalBlock.getPrevSiblingKey(),
      nextSibling: originalBlock.getNextSiblingKey(),
    };

    const nextNewParentBlock = newParentBlock.merge({
      ...originalBlockSibling,
      children: List([originalBlockKey, belowBlockKey]),
    });

    const nextOriginalBlock = originalBlock.merge({
      parent: parentBlockKey,
      prevSibling: null,
      nextSibling: belowBlockKey,
    });
    const nextBelowBlock = belowBlock.merge({
      parent: parentBlockKey,
      prevSibling: originalBlockKey,
      nextSibling: null,
    });

    blocks.set(originalParentBlockKey, nextOriginalParentBlock);
    blocks.set(parentBlockKey, nextNewParentBlock);
    blocks.set(originalBlockKey, nextOriginalBlock);
    blocks.set(belowBlockKey, nextBelowBlock);
  });
};

function CreateNestBlockPlugin() {
  this.apply = getState => {
    const { hooks } = getState();

    hooks.handleKeyCommand.tap(
      'CreateNestBlockPlugin',
      (command, editorState) => {
        const selection = editorState.getSelection();
        if (command !== 'split-block') return 'not-handled';
        if (!selection.isCollapsed()) return 'not-handled';

        const currentContent = editorState.getCurrentContent();
        const endKey = selection.getEndKey();
        const block = currentContent.getBlockForKey(endKey);
        const blockParentKey = block.parent;
        if (!blockParentKey) return 'not-handled';
        const parentBlock = currentContent.getBlockForKey(blockParentKey);
        if (!parentBlock) return 'not-handled';
        const isFlexRow = parentBlock.getData().get('flexRow');

        if (!isFlexRow) return 'not-handled';
        const selectionState = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const key = selectionState.getAnchorKey();
        const blockMap = contentState.getBlockMap();
        const blockToSplit = blockMap.get(key);

        const newParentKey = generateRandomKey();
        const newParentBlock = blockToSplit.merge({
          key: newParentKey,
          text: '',
          data: Map(),
        });

        const keyBelow = generateRandomKey();
        const blockBelow = blockToSplit.merge({
          key: keyBelow,
          text: '',
          data: Map(),
          children: List(),
        });

        const blocksBefore = blockMap.toSeq().takeUntil(function(v) {
          return v === blockToSplit;
        });
        const blocksAfter = blockMap
          .toSeq()
          .skipUntil(function(v) {
            return v === blockToSplit;
          })
          .rest();

        // `blocksBefore.toArray()` to check value
        const newBlocks = blocksBefore
          .concat(
            [
              [newParentKey, newParentBlock],
              [key, blockToSplit],
              [keyBelow, blockBelow],
            ],
            blocksAfter
          )
          .toOrderedMap();

        const newNewBlocks = updateBlockMapLinks(
          newBlocks,
          newParentBlock,
          blockToSplit,
          blockBelow
        );

        const newContentState = contentState.merge({
          blockMap: newNewBlocks,
          selectionBefore: selectionState,
          selectionAfter: selectionState.merge({
            anchorKey: keyBelow,
            anchorOffset: 0,
            focusKey: keyBelow,
            focusOffset: 0,
            isBackward: false,
          }),
        });

        const newState = EditorState.push(editorState, newContentState);

        hooks.setState.call(newState);

        return 'handled';
      }
    );
  };
}

export default CreateNestBlockPlugin;
