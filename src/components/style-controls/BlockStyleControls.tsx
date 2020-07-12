import React, { useCallback } from 'react';
import { GetEditor } from '../../types';

import StyleControlButton from './StyleControlButton';

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  // {label: 'H2', style: 'header-two'},
  // {label: 'H3', style: 'header-three'},
  // {label: 'H4', style: 'header-four'},
  // {label: 'H5', style: 'header-five'},
  // {label: 'H6', style: 'header-six'},
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = ({ getEditor }: { getEditor: GetEditor }) => {
  const { editorState } = getEditor();
  const toggleBlockStyleControl = useCallback(
    blockType => {
      // 这个地方需要用最新的`editorState`;如果不进行这一步的话，editorState
      // 会是比较老的。
      const { editorState: latestEditorState, hooks } = getEditor();
      hooks.toggleWaterfallBlockType.call(null, latestEditorState, blockType);
    },
    [getEditor]
  );

  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-block-controls">
      {BLOCK_TYPES.map(type => (
        <StyleControlButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={toggleBlockStyleControl}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default BlockStyleControls;
