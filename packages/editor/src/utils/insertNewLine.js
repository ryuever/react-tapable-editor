const newContent = Modifier.insertText(
  contentState,
  selection,
  placeholder,
);

const newEditorState = EditorState.push(
  editorState,
  newContent,
  'insert-text'
);