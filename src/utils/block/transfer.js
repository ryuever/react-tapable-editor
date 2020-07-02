import transferToTop from "./transferToTop";
import transferToRight from "./transferToRight";
import transferToBottom from "./transferToBottom";
import transferToLeft from "./transferToLeft";
import removeBlock from "./removeBlock";
import wrapBlock from "./wrapBlock";
const requiredError = prop => {
  throw new Error(`${prop} is required in transfer function`);
};

const transfer = (editorState, sourceBlockKey, targetBlockKey, position) => {
  if (!editorState) requiredError("editorState");
  if (!sourceBlockKey) requiredError("sourceBlockKey");
  if (!targetBlockKey) requiredError("targetBlockKey");
  if (!position) requiredError("position");

  const currentState = editorState.getCurrentContent();
  let blockMap = currentState.getBlockMap();
  blockMap = removeBlock(blockMap, sourceBlockKey);
  blockMap = wrapBlock(blockMap, targetBlockKey);
  return currentState.merge({
    blockMap: blockMap
  });

  // switch (position) {
  //   case "top":
  //     return transferToTop(editorState, sourceBlockKey, targetBlockKey);
  //   case "right":
  //     return transferToRight(editorState, sourceBlockKey, targetBlockKey);
  //   case "bottom":
  //     return transferToBottom(editorState, sourceBlockKey, targetBlockKey);
  //   case "Left":
  //     return transferToLeft(editorState, sourceBlockKey, targetBlockKey);
  // }
};

export default transfer;
