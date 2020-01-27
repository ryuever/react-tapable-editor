// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove
// https://media.prod.mdn.mozit.cloud/attachments/2013/03/05/5031/5692db994e59bae0b1c9e66f7df259b9/draggable_elements.html

import React, { useCallback, useState, useRef, useMemo } from 'react'
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey'
import './styles.css'

const LeftBar = React.memo(props => {
  const { visible, resizeMode } = props
  if (!visible && !resizeMode) return null
  return (
    <div className="bar-left">
      <div className="bar" />
    </div>
  )
}, (prev, next) => prev.visible === next.visible && prev.resizeMode === next.resizeMode)

const RightBar = React.memo(props => {
  const { visible, resizeMode } = props
  if (!visible && !resizeMode) return null
  return (
    <div className="bar-right">
      <div className="bar" />
    </div>
  )
}, (prev, next) => prev.visible === next.visible && prev.resizeMode === next.resizeMode)

const Resizable = WrappedComponent => props => {
  const [leftBarVisible, setLeftBarVisible] = useState(false)
  const [rightBarVisible, setRightBarVisible] = useState(false)
  const resizeMode = useRef(false)
  const resizeModeStartCoordinate = useRef()
  const resizeModeStartNodeLayout = useRef()
  const resizeModeLastMovePoint = useRef()
  const { block } = props
  const blockKey = block.getKey()
  const dataOffsetKey = DraftOffsetKey.encode(blockKey, 0, 0)
  const node = document.querySelector(
    `[data-offset-key="${dataOffsetKey}"]`
  )

  const onMouseDownHandler = useCallback(e => {
    document.addEventListener('mousemove', onMouseMoveHandler)
    document.addEventListener('mouseup', onMouseUpHandler)

    resizeMode.current = true
    const { clientX, clientY, currentTarget } = e
    const offsetWidth = currentTarget.offsetWidth
    const offsetHeight = currentTarget.offsetHeight

    resizeModeStartCoordinate.current = {
      clientX,
      clientY,
    }
    resizeModeStartNodeLayout.current = {
      width: offsetWidth,
      height: offsetHeight,
    }
  }, [])

  const onMouseUpHandler = useCallback(e => {
    document.removeEventListener('mousemove', onMouseMoveHandler)
    document.removeEventListener('mouseup', onMouseUpHandler)

    console.log('up ====')

    resizeMode.current = false
    resizeModeStartCoordinate.current = null
    resizeModeStartNodeLayout.current = null
  }, [])

  const onMouseMoveHandler = useCallback(e => {
    const { clientX, clientY, currentTarget }  = e
    if (!resizeMode.current) return

    const {
      clientX: oldClientX,
      clientY: oldClientY,
    } = resizeModeStartCoordinate.current

    // if positive, means amplify
    // if negative, means narrow
    const deltaX = clientX - oldClientX
    const deltaY = clientY - oldClientY

    const nextWidth = `${resizeModeStartNodeLayout.current.width + deltaX * 2}px`
    const node = document.querySelector(
      `[data-offset-key="${dataOffsetKey}"]`
    )
    console.log('client x : ', clientX, oldClientX, deltaX, nextWidth, node)

    node.style.width = nextWidth
  }, [])

  const onMouseEnterHandler = useCallback(e => {
    e.preventDefault()
    if (!leftBarVisible) { setLeftBarVisible(true) }
    if (!rightBarVisible) { setRightBarVisible(true)}
  }, [leftBarVisible, rightBarVisible])

  const onMouseLeaveHandler = useCallback(e => {
    e.preventDefault()
    if (leftBarVisible) { setLeftBarVisible(false) }
    if (rightBarVisible) { setRightBarVisible(false)}
  }, [leftBarVisible, rightBarVisible])



  return (
    <div
      // onMouseMove={onMouseMoveHandler}
      onMouseDown={onMouseDownHandler}
      // onMouseUp={onMouseUpHandler}
      onMouseLeave={onMouseLeaveHandler}
      onMouseEnter={onMouseEnterHandler}
      className="resizable-component"
    >
      <LeftBar visible={leftBarVisible} resizeMode={resizeMode.current} />
      <WrappedComponent {...props} />
      <RightBar visible={rightBarVisible} resizeMode={resizeMode.current} />
    </div>
  )
}

export default Resizable

