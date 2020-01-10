import React, { useCallback, useState } from 'react'
import './styles.css'
import ImageAlignCenter from '../button/ImageAlignCenter'
import ImageAlignLeftFillContent from '../button/ImageAlignLeftFillContent'
import ImageAlignRightFillContent from '../button/ImageAlignRightFillContent'
import ImageAlignLeft from '../button/ImageAlignLeft'

const ImageAlignCenterButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <ImageAlignCenter active={active} onClick={handleClick}/>
}

const ImageAlignLeftButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <ImageAlignLeft active={active} onClick={handleClick} />
}

const ImageAlignLeftFillContentButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <ImageAlignLeftFillContent active={active} onClick={handleClick} />
}

const ImageAlignRightFillContentButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <ImageAlignRightFillContent active={active} onClick={handleClick} />
}

const Toolbar = props => {
  const { forwardRef } = props
  const [activeKey, setActiveKey] = useState()

  return (
    <div className="image-toolbar" ref={forwardRef}>
      <div className="image-toolbar-inner">
        <div className="image-toolbar-action-group">
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
      <div className="arrow-down" />
    </div>
  )
}

export default Toolbar