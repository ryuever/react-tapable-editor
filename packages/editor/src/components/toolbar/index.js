import React, { useCallback } from 'react'
import './styles.css'
import ImageAlignCenter from '../button/ImageAlignCenter'
import ImageAlignLeftFillContent from '../button/ImageAlignLeftFillContent'
import ImageAlignRightFillContent from '../button/ImageAlignRightFillContent'
import ImageAlignLeft from '../button/ImageAlignLeft'

const ActionButton = props => {
  const { onClick, children } = props
  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') onClick()
  })

  return (
    <span className="icon-wrapper" onClick={handleClick}>
      {children}
    </span>
  )
}

const ImageAlignCenterButton = props => {
  return (
    <ActionButton>
      <ImageAlignCenter />
    </ActionButton>
  )
}

const ImageAlignLeftButton = props => {
  return (
    <ActionButton>
      <ImageAlignLeft />
    </ActionButton>
  )
}

const ImageAlignLeftFillContentButton = props => {
  return (
    <ActionButton>
      <ImageAlignLeftFillContent />
    </ActionButton>
  )
}

const ImageAlignRightFillContentButton = props => {
  return (
    <ActionButton>
      <ImageAlignRightFillContent />
    </ActionButton>
  )
}

const Toolbar = props => {
  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        <div className="action-group">
          <ImageAlignLeftButton />
          <ImageAlignLeftFillContentButton />
          <ImageAlignCenterButton />
          <ImageAlignRightFillContentButton />
        </div>
      </div>
    </div>
  )
}

export default Toolbar