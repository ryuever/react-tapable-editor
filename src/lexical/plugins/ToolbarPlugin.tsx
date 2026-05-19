import { useCallback } from 'react';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
} from 'lexical';
import { $createCodeNode } from '@lexical/code';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

type BlockType = 'paragraph' | 'h1' | 'h2' | 'quote' | 'code';

const Button = ({
  ariaLabel,
  label,
  onClick,
}: {
  ariaLabel: string;
  label: string;
  onClick(): void;
}) => (
  <button
    aria-label={ariaLabel}
    className="rte-toolbar-button"
    type="button"
    onClick={onClick}
  >
    {label}
  </button>
);

function setBlockType(editor: LexicalEditor, blockType: BlockType) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    if (blockType === 'paragraph') {
      $setBlocksType(selection, () => $createParagraphNode());
      return;
    }

    if (blockType === 'quote') {
      $setBlocksType(selection, () => $createQuoteNode());
      return;
    }

    if (blockType === 'code') {
      $setBlocksType(selection, () => $createCodeNode());
      return;
    }

    $setBlocksType(selection, () => $createHeadingNode(blockType));
  });
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const toggleLink = useCallback(() => {
    const url = window.prompt('Link URL');
    if (!url) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  }, [editor]);

  return (
    <div className="rte-toolbar" aria-label="Editor toolbar">
      <Button
        ariaLabel="Bold"
        label="B"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      />
      <Button
        ariaLabel="Italic"
        label="I"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
      />
      <Button
        ariaLabel="Underline"
        label="U"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
      />
      <Button
        ariaLabel="Strikethrough"
        label="S"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
      />
      <Button
        ariaLabel="Inline code"
        label="{}"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
      />
      <span className="rte-toolbar-divider" />
      <Button
        ariaLabel="Paragraph"
        label="P"
        onClick={() => setBlockType(editor, 'paragraph')}
      />
      <Button
        ariaLabel="Heading 1"
        label="H1"
        onClick={() => setBlockType(editor, 'h1')}
      />
      <Button
        ariaLabel="Heading 2"
        label="H2"
        onClick={() => setBlockType(editor, 'h2')}
      />
      <Button
        ariaLabel="Quote"
        label="Quote"
        onClick={() => setBlockType(editor, 'quote')}
      />
      <Button
        ariaLabel="Code block"
        label="Code"
        onClick={() => setBlockType(editor, 'code')}
      />
      <span className="rte-toolbar-divider" />
      <Button
        ariaLabel="Unordered list"
        label="UL"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      />
      <Button
        ariaLabel="Ordered list"
        label="OL"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      />
      <Button
        ariaLabel="Remove list"
        label="No List"
        onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}
      />
      <Button ariaLabel="Link" label="Link" onClick={toggleLink} />
    </div>
  );
}
