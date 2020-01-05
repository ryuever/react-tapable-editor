import React, { useCallback, useState } from 'react'
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

const ImageAlignCenterButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return (
    <ActionButton onClick={handleClick}>
      <ImageAlignCenter active={active}/>
    </ActionButton>
  )
}

const ImageAlignLeftButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))

  return (
    <ActionButton onClick={handleClick}>
      <ImageAlignLeft active={active} />
    </ActionButton>
  )
}

const ImageAlignLeftFillContentButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))

  return (
    <ActionButton onClick={handleClick}>
      <ImageAlignLeftFillContent active={active} />
    </ActionButton>
  )
}

const ImageAlignRightFillContentButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))

  return (
    <ActionButton onClick={handleClick}>
      <ImageAlignRightFillContent active={active} />
    </ActionButton>
  )
}

const Toolbar = props => {
  const [activeKey, setActiveKey] = useState()

  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        <div className="action-group">
          <ImageAlignLeftButton
            activeKey="left"
            active={'left' === activeKey}
            setActiveKey={setActiveKey}
          />
          <ImageAlignLeftFillContentButton
            activeKey="leftFill"
            active={'leftFill' === activeKey}
            setActiveKey={setActiveKey}
          />
          <ImageAlignCenterButton
            activeKey="center"
            active={'center' === activeKey}
            setActiveKey={setActiveKey}
          />
          <ImageAlignRightFillContentButton
            activeKey="rightFill"
            active={'rightFill' === activeKey}
            setActiveKey={setActiveKey}
          />
        </div>
      </div>
    </div>
  )
}

export default Toolbar