import React from 'react'
import './styles/index.css'

const Image = props => {
  const {block, contentState} = props

  const meta = contentState.getEntity(block.getEntityAt(0)).getData()
  const { src } = meta

  return (
    <div className="image-wrapper">
      <img src={src} className="image" />
    </div>
  )
}

export default Image