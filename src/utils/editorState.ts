import invariant from 'invariant';
import { Modifier, EditorState } from 'draft-js';

// https://github.com/facebook/draft-js/blob/master/src/component/handlers/edit/commands/moveSelectionForward.js#L27
// https://github.com/facebook/draft-js/blob/master/src/component/handlers/edit/commands/keyCommandMoveSelectionToStartOfBlock.js
export const moveSelectionForward = (
  editorState: EditorState,
  maxDistance: number
) => {
  const selection = editorState.getSelection(); // Should eventually make this an invariant

  process.env.NODE_ENV !== 'production'
    ? invariant(
        selection.isCollapsed(),
        'moveSelectionForward should only be called with a collapsed SelectionState'
      )
    : void 0;
  const key = selection.getStartKey();
  const offset = selection.getStartOffset();
  const content = editorState.getCurrentContent();
  let focusOffset;
  const block = content.getBlockForKey(key);

  if (maxDistance > block.getText().length - offset) {
    focusOffset = block.getText().length;
  } else {
    focusOffset = offset + maxDistance;
  }

  return selection.merge({
    focusOffset,
    anchorOffset: focusOffset,
  });
};

export const splitAtLastCharacterAndForwardSelection = (
  editorState: EditorState
): EditorState => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const endKey = selection.getEndKey();
  const block = currentContent.getBlockForKey(endKey);
  const blockSize = block.getLength();
  const newCurrentState = Modifier.splitBlock(
    currentContent,
    selection.merge({
      anchorOffset: blockSize - 1,
      focusOffset: blockSize - 1,
    })
  );

  const nextState = EditorState.push(
    editorState,
    newCurrentState,
    'split-block'
  );
  return EditorState.forceSelection(
    nextState,
    moveSelectionForward(nextState, 1)
  );
};
