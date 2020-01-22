import React, { useCallback, useState } from 'react'
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

  const onMouseDownHandler = useCallback(e => {
    resizeMode.current = true
    const { clientX, clientY } = e
    resizeModeStartCoordinate.current = {
      clientX,
      clientY,
    }
  }, [])

  const onMouseUpHandler = useCallback(e => {
    resizeMode.current = false
    resizeModeStartCoordinate.current = null
  }, [])

  const onMouseMoverHandler = useCallback(e => {
    const { clientX, clientY }  = e
    console.log('client x : ', clientX, clientY)
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