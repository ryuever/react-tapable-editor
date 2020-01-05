import React, { useCallback } from 'react'

import './action.css'

export default WrappedComponent => props => {
  const { onClick, ...rest } = props
  const handleClick = useCallback(() => {
    console.log('xxx ')
    if (typeof onClick === 'function') onClick()
  })

  return (
    <span className="icon-wrapper" onClick={handleClick}>
      <WrappedComponent {...rest} />
    </span>
  )
}