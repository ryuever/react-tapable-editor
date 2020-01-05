import React, { memo } from 'react'

export default WrappedComponent => memo(props => {
  const { active, ...rest } = props
  const fill = active ? '#34e79a' : '#fff'

  return (
    <WrappedComponent fill={fill} {...rest} />
  )
}, (next, prev) => next.active === prev.active)