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

  switch (position) {
    case "top":
      transferToTop(editorState, sourceBlockKey, targetBlockKey);
      break;
    case "right":
      transferToRight(editorState, sourceBlockKey, targetBlockKey);
      break;
    case "bottom":
      transferToBottom(editorState, sourceBlockKey, targetBlockKey);
      break;
    case "Left":
      transferToLeft(editorState, sourceBlockKey, targetBlockKey);
      break;
  }
};

export default transfer;
