import React, { useCallback } from 'react'
import StyleControlButton from './StyleControlButton'

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  // {label: 'H2', style: 'header-two'},
  // {label: 'H3', style: 'header-three'},
  // {label: 'H4', style: 'header-four'},
  // {label: 'H5', style: 'header-five'},
  // {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = ({ getEditor }) => {
  const { editorState, hooks } = getEditor()
  const toggleBlockStyleControl = useCallback(blockType => {
    console.log('trigger block type : ', blockType)
    hooks.toggleBlockType.call(blockType)
  }, [])

  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="RichEditor-block-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleControlButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={toggleBlockStyleControl}
          style={type.style}
        />
      )}
    </div>
  );
}

export default BlockStyleControls