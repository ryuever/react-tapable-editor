import React from 'react'
import { withEditor } from '../../index'
import BlockStyleControls from './BlockStyleControls'
import InlineStyleControls from './InlineStyleControls'
import './styles/index.css'

const StyleControls = ({ getEditor }) => {
  return (
    <div className="miuffy-editor-controls">
      <BlockStyleControls getEditor={getEditor} />
      <div className="delimiter" />
      <InlineStyleControls getEditor={getEditor} />
    </div>
  )
}

export default withEditor(StyleControls)