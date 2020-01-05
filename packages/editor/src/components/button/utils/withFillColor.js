import React, { memo } from 'react'

export default WrappedComponent => memo(props => {
  const { active } = props
  const fill = active ? '#34e79a' : '#fff'

  return (
    <WrappedComponent fill={fill} />
  )
}, (next, prev) => next.active === prev.active)