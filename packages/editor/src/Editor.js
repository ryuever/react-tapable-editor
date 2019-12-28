import React, {
  forwardRef,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import {
  Editor,
  EditorState,
} from 'draft-js';
import StyleControls from './components/style-controls'
import Title from './components/title'

import './style.css'
// https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#missing-draftcss
import 'draft-js/dist/Draft.css'
import { withEditor } from './index';

const NewEditor = props => {
  const {
    getEditor,
    forwardRef,
    placeholder,
  } = props
  const { hooks, editorState } = getEditor()
  const didUpdate = useRef(false)

  useEffect(() => {
    if (didUpdate.current) {
      hooks.didUpdate.call(editorState)
      hooks.updatePlaceholder.call(editorState, placeholder)
    }
  })

  useEffect(() => {
    hooks.updatePlaceholder.call(editorState, placeholder)
    didUpdate.current = true
  }, [])

  const onChange = useCallback(editorState => {
    hooks.onChange.call(editorState)
  }, [])

  const handleKeyCommand = useCallback((command, editorState) => {
    return hooks.handleKeyCommand.call(command, editorState)
  }, [])

  const getBlockStyle = useCallback(block => {
    return hooks.blockStyleFn.call(block)
  })

  const handleBlockRender = useCallback(contentBlock => {
    return hooks.blockRendererFn.call(contentBlock, editorState)
  })

  let className = 'miuffy-editor';
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  return (
    <div className="miuffy-editor-root">
      <StyleControls editorState={editorState} />

      <div className="miuffy-editor">
        <Title />
        <Editor
          editorState={editorState}
          blockStyleFn={getBlockStyle}
          blockRendererFn={handleBlockRender}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          ref={forwardRef}
        />
      </div>
    </div>
  )
}

const WrappedEditor = withEditor(NewEditor)

export default forwardRef((props, ref) => (
  <WrappedEditor {...props} forwardRef={ref} />
))