import React, { useRef, useEffect, useCallback } from 'react'
import Divider from './Divider'

import Link from '../button/Link'
import Unlink from '../button/Unlink'

import { createLinkAtSelection } from '../../utils/createEntity'

const InputBar = ({ getEditor }) => {
  const inputRef = useRef()
  const { hooks } = getEditor()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const submit = value => {
    const { editorState, hooks } = getEditor()
    const newState = createLinkAtSelection(editorState, value)
    hooks.setState.call(newState)
  }

  const onKeyDownHandler = useCallback(e => {
    const { key } = e
    if (key === 'Enter') {
      e.preventDefault()
      const inputValue = e.target.value
      submit(inputValue)
      hooks.hideInlineToolbar.call()
    } else if (key === 'Escape') {
      e.preventDefault()
    }
  }, [])

  return (
    <div className="inline-toolbar-link-inner">
      <input
        ref={inputRef}
        className="inline-link-input"
        placeholder="Paste your link, such as http://google.com..."
        onKeyDown={onKeyDownHandler}
      />
      <Divider />
      <div className='link-action-group'>
        <Link active={false}/>
        <Unlink active={false} />
      </div>
    </div>
  )
}

export default InputBar