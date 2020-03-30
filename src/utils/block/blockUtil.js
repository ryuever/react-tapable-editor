import Immutable from "immutable";
import generateRandomKey from "draft-js/lib/generateRandomKey";
import { findLastBlockWithNullParent } from "./updateBlockMapLinks";
const { List, Map } = Immutable;

const BlockUtil = {
  /**
   * Normally, it will insert a new line block with the same level...
   */
  insertNewLine: function(editorState) {},

  /**
   * https://github.com/facebook/draft-js/blob/master/src/model/transaction/splitBlockInContentState.js#L90
   * Append a new empty line after all the blocks.
   * 1. Remember current selection
   * 2. Add a new empty block
   * 3. reset selection
   */

  insertNewLineAfterAll: function(currentState) {
    const lastBlock = currentState.getLastBlock();
    const lastBlockText = lastBlock.getText();

    // insert an empty line only if the last block is not a empty line.
    if (!lastBlockText) return currentState;

    var keyBelow = generateRandomKey();
    const blockMap = currentState.getBlockMap();
    let blockBelow = lastBlock.merge({
      parent: null,
      children: [],
      key: keyBelow,
      type: "unstyled",
      text: "",
      characterList: List(),
      depth: 0,
      data: Map()
    });

    let newBlockMap = blockMap
      .toSeq()
      .concat([[keyBelow, blockBelow]])
      .toOrderedMap();

    const lastBlockWithNullParent = findLastBlockWithNullParent(currentState);
    if (lastBlockWithNullParent) {
      let blockToUpdate = lastBlockWithNullParent.last();
      const blockToUpdateKey = blockToUpdate.getKey();
      blockBelow = blockBelow.merge({
        prevSibling: blockToUpdateKey
      });
      blockToUpdate = blockToUpdate.merge({
        nextSibling: keyBelow
      });
      newBlockMap = newBlockMap.set(keyBelow, blockBelow);
      newBlockMap = newBlockMap.set(blockToUpdateKey, blockToUpdate);
    }

    return currentState.merge({
      blockMap: newBlockMap
    });
  },

  removeEmptyLineAfterAll: function(editorState) {},

  insertDelimiter: function(editorState) {}
};

export default BlockUtil;
