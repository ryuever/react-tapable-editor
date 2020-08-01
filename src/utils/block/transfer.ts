import { EditorState } from 'draft-js';
import horizontalTransfer from './horizontalTransfer';
import verticalTransfer from './verticalTransfer';
import { Position, ContentNodeState } from '../../types';

const requiredError = (prop: EditorState | string | Position) => {
  throw new Error(`${prop} is required in transfer function`);
};

const transfer = (
  editorState: EditorState,
  sourceBlockKey: string,
  targetBlockKey: string,
  position: Position
) => {
  if (!editorState) requiredError('editorState');
  if (!sourceBlockKey) requiredError('sourceBlockKey');
  if (!targetBlockKey) requiredError('targetBlockKey');
  if (!position) requiredError('position');
  const currentState = editorState.getCurrentContent() as ContentNodeState;

  let blockMap;
  switch (position) {
    case 'top':
      blockMap = verticalTransfer(
        editorState,
        sourceBlockKey,
        targetBlockKey,
        Position.Top
      );
      break;
    case 'right':
      blockMap = horizontalTransfer(
        editorState,
        sourceBlockKey,
        targetBlockKey,
        Position.Right
      );
      break;
    case 'bottom':
      blockMap = verticalTransfer(
        editorState,
        sourceBlockKey,
        targetBlockKey,
        Position.Bottom
      );
      break;
    case 'left':
      blockMap = horizontalTransfer(
        editorState,
        sourceBlockKey,
        targetBlockKey,
        Position.Left
      );
      break;
  }

  return currentState.merge({
    blockMap,
  });
};

export default transfer;
