import transferToTop from "./transferToTop";
import transferToRight from "./transferToRight";
import transferToBottom from "./transferToBottom";
import transferToLeft from "./transferToLeft";

const requiredError = prop => {
  throw new Error(`${prop} is required in transfer function`);
};

const transfer = (editorState, sourceBlockKey, targetBlockKey, position) => {
  if (!editorState) requiredError("editorState");
  if (!sourceBlockKey) requiredError("sourceBlockKey");
  if (!targetBlockKey) requiredError("targetBlockKey");
  if (!position) requiredError("position");
  const currentState = editorState.getCurrentContent();

  let blockMap;
  switch (position) {
    case "top":
      blockMap = transferToTop(editorState, sourceBlockKey, targetBlockKey);
      break;
    case "right":
      blockMap = transferToRight(editorState, sourceBlockKey, targetBlockKey);
      break;
    case "bottom":
      blockMap = transferToBottom(editorState, sourceBlockKey, targetBlockKey);
      break;
    case "Left":
      blockMap = transferToLeft(editorState, sourceBlockKey, targetBlockKey);
      break;
  }

  return currentState.merge({
    blockMap: blockMap
  });
};

export default transfer;
