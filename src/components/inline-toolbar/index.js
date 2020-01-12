import React, { useState, useRef, useEffect, useCallback } from 'react'
import { withEditor } from '../../index';
import Immutable from 'immutable'
import './styles.css'
import StyleControls from './StyleControls'
import InputBar from './InputBar'

import getSelectionInlineStyle from '../../utils/getSelectionInlineStyle'
import getSelectionBlockTypes from '../../utils/getSelectionBlockTypes'

const Toolbar = props => {
  const { forwardRef, getEditor } = props
  const [value, setValue] = useState({
    styles: new Immutable.OrderedSet(),
    blockTypes: [],
    inDisplayMode: true,
  })
  const inDisplayModeRef = useRef(true)

  useEffect(() => {
    const { hooks } = getEditor()
    hooks.inlineBarChange.tap('InlineToolbar', (editorState, visibility) => {
      const nextValue = {
        inDisplayMode: visibility === 'hidden' ? true : inDisplayModeRef.current
      }

      if (editorState) {
        nextValue.styles = getSelectionInlineStyle(editorState)
        nextValue.blockTypes = getSelectionBlockTypes(editorState)
      } else {
        nextValue.styles = new Immutable.OrderedSet()
        nextValue.blockTypes = []
      }

      inDisplayModeRef.current = nextValue.inDisplayMode

      setValue(nextValue)
    })
  }, [])

  const toggleDisplayMode = useCallback(() => {
    setValue({
      ...value,
      inDisplayMode: !inDisplayMode,
    })
    inDisplayModeRef.current = !inDisplayMode
  }, [inDisplayMode])

  const { styles, blockTypes, inDisplayMode } = value

  return (
    <div className="inline-toolbar" ref={forwardRef}>
      {inDisplayMode && (
        <StyleControls
          styles={styles}
          blockTypes={blockTypes}
          getEditor={getEditor}
          toggleDisplayMode={toggleDisplayMode}
        />
      )}
      {!inDisplayMode && <InputBar getEditor={getEditor}/>}
      <div className="arrow-down" />
    </div>
  )
}

const MemoToolbar = React.memo(props => {
  return <Toolbar {...props} />
}, () => true)

export default withEditor(MemoToolbar)