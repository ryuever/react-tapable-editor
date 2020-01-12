import React, { useRef, useEffect } from 'react'
import Divider from './Divider'

import Link from '../button/Link'
import Unlink from '../button/Unlink'

const InputBar = ({ getEditor }) => {
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <div className="inline-toolbar-link-inner">
      <input
        ref={inputRef}
        className="inline-link-input"
        placeholder="Paste your link, such as http://google.com..."
      />
      <Divider />
      <div className='link-action-group'>
        <Link
          active={false}
        />
        <Unlink
          active={false}
        />
      </div>
    </div>
  )
}

export default InputBar