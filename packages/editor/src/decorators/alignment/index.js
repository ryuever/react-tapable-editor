import React from 'react'
import './styles.css'

const Alignment = WrappedComponent => props => {
  return (
    <div>
      <WrappedComponent {...props} />
    </div>
  )
}

export default Alignment