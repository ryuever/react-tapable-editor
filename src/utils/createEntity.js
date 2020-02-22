import { RichUtils } from "draft-js";

const createLinkAtSelection = (editorState, url) => {
  const contentState = editorState
    .getCurrentContent()
    .createEntity("LINK", "MUTABLE", { url });
  const entityKey = contentState.getLastCreatedEntityKey();

  return RichUtils.toggleLink(
    editorState,
    editorState.getSelection(),
    entityKey
  );
};

const createLinkSpanAtSelection = editorState => {
  const selection = editorState.getSelection();
  const startKey = selection.getStartKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();
  const currentContent = editorState.getCurrentContent();
  const contentBlock = currentContent.getBlockForKey(startKey);

  const text = contentBlock.getText().slice(startOffset, endOffset);

  const contentState = editorState
    .getCurrentContent()
    .createEntity("LINK_SPAN", "MUTABLE", { text });
  const entityKey = contentState.getLastCreatedEntityKey();

  return RichUtils.toggleLink(
    editorState,
    editorState.getSelection(),
    entityKey
  );
};

export { createLinkAtSelection, createLinkSpanAtSelection };
