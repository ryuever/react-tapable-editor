import horizontalTransfer from './horizontalTransfer';
import verticalTransfer from './verticalTransfer';

const requiredError = prop => {
  throw new Error(`${prop} is required in transfer function`);
};

const transfer = (editorState, sourceBlockKey, targetBlockKey, position) => {
  if (!editorState) requiredError('editorState');
  if (!sourceBlockKey) requiredError('sourceBlockKey');
  if (!targetBlockKey) requiredError('targetBlockKey');
  if (!position) requiredError('position');
  const currentState = editorState.getCurrentContent();

  let blockMap;
  switch (position) {
    case 'top':
      blockMap = verticalTransfer(
        editorState,
        sourceBlockKey,
        targetBlockKey,
        'top'
      );
      break;
    case 'right':
      blockMap = horizontalTransfer(
        editorState,
        sourceBlockKey,
        targetBlockKey,
        'right'
      );
      break;
    case 'bottom':
      blockMap = verticalTransfer(
        editorState,
        sourceBlockKey,
        targetBlockKey,
        'bottom'
      );
      break;
    case 'left':
      blockMap = horizontalTransfer(
        editorState,
        sourceBlockKey,
        targetBlockKey,
        'left'
      );
      break;
  }

  return currentState.merge({
    blockMap,
  });
};

export default transfer;
