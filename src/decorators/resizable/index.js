// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove
// https://media.prod.mdn.mozit.cloud/attachments/2013/03/05/5031/5692db994e59bae0b1c9e66f7df259b9/draggable_elements.html

import React, { useCallback, useState, useRef } from 'react'
import './styles.css'

const LeftBar = React.memo(() => (
  <div className="bar-left">
    <div className="bar" />
  </div>
))

const RightBar = React.memo(() => (
  <div className="bar-right">
    <div className="bar" />
  </div>
))

const Resizable = WrappedComponent => props => {
  const [leftBarVisible, setLeftBarVisible] = useState(false)
  const [rightBarVisible, setRightBarVisible] = useState(false)
  const resizeMode = useRef(false)
  const resizeModeStartCoordinate = useRef()
  const resizeModeStartNodeLayout = useRef()
  const resizeModeLastMovePoint = useRef()

  const onMouseDownHandler = useCallback(e => {
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
    resizeMode.current = false
    resizeModeStartCoordinate.current = null
    resizeModeStartNodeLayout.current = null
  }, [])

  const onMouseMoverHandler = useCallback(e => {
    const { clientX, clientY, currentTarget }  = e
    if (!resizeMode.current) return
    if (!resizeModeLastMovePoint.current) {
      resizeModeLastMovePoint.current = {
        clientX,
        clientY
      }
      return
    }
    const {
      clientX: oldClientX,
      clientY: oldClientY,
    } = resizeModeLastMovePoint.current

    // if positive, means amplify
    // if negative, means narrow
    const deltaX = clientX - oldClientX
    const deltaY = clientY - oldClientY

    resizeModeLastMovePoint.current = {
      clientX,
      clientY
    }

    console.log('client x : ', clientX, clientY,  deltaX, deltaY)
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
      onMouseMove={onMouseMoverHandler}
      onMouseDown={onMouseDownHandler}
      onMouseUp={onMouseUpHandler}
      onMouseLeave={onMouseLeaveHandler}
      onMouseEnter={onMouseEnterHandler}
      className="resizable-component"
    >
      {leftBarVisible && <LeftBar />}
      <WrappedComponent {...props} />
      {rightBarVisible && <RightBar />}
    </div>
  )
}

export default Resizable

