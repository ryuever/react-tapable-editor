import React from 'react'
import BlockStyleControls from './BlockStyleControl'
import InlineStyleControls from './InlineStyleControl'
import './style.css'

export default props => {
  const { editorState, toggleBlockType, toggleInlineStyle } = props

  return (
    <div className="miuffy-editor-controls">
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <div className="delimiter" />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
    </div>
  )
}