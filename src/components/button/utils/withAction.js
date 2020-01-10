import React, { useCallback } from 'react'

import './action.css'

export default WrappedComponent => props => {
  const { onClick, ...rest } = props
  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') onClick()
  })
  const onMouseDownHandler = useCallback(e => {
    e.preventDefault()
  }, [])

  return (
    <button
      onClick={handleClick}
      onMouseDown={onMouseDownHandler}
      className="icon-button icon-wrapper"
    >
      <WrappedComponent {...rest} />
    </button>
  )
}