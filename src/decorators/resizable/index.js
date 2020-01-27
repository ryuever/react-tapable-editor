// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove
// https://media.prod.mdn.mozit.cloud/attachments/2013/03/05/5031/5692db994e59bae0b1c9e66f7df259b9/draggable_elements.html

import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react'
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey'
import './styles.css'

const LeftBar = React.memo(props => {
  const {
    visible,
    resizeMode,
    onMouseEnterHandler,
    onMouseLeaveHandler,
  } = props

  console.log('left : ', resizeMode, visible)
  const shouldRender = visible || resizeMode
  return (
    <div
      className="bar-left"
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      {shouldRender && <div className="bar" />}
    </div>
  )
}, (prev, next) => prev.visible === next.visible && prev.resizeMode === next.resizeMode)

const RightBar = React.memo(props => {
  const {
    visible,
    resizeMode,
    onMouseEnterHandler,
    onMouseLeaveHandler,
  } = props
  const shouldRender = visible || resizeMode
  console.log('right ', resizeMode, visible)
  return (
    <div
      className="bar-right"
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      { shouldRender && <div className="bar" />}
    </div>
  )
}, (prev, next) => prev.visible === next.visible && prev.resizeMode === next.resizeMode)

const Resizable = WrappedComponent => props => {
  const [leftBarVisible, setLeftBarVisible] = useState(false)
  const [rightBarVisible, setRightBarVisible] = useState(false)
  const [resizeMode, setResizeMode] = useState(false)
  const resizeModeStartCoordinate = useRef()
  const resizeModeStartNodeLayout = useRef()
  const { block, blockProps } = props
  const { alignment } = blockProps
  const blockKey = block.getKey()
  const dataOffsetKey = DraftOffsetKey.encode(blockKey, 0, 0)

  const onMouseDownHandler = useCallback(e => {
    setResizeMode(true)
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

  useEffect(() => {
    if (resizeMode) {
      document.addEventListener('mousemove', onMouseMoveHandler)
      document.addEventListener('mouseup', onMouseUpHandler)
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMoveHandler)
      document.removeEventListener('mouseup', onMouseUpHandler)
    }
  }, [resizeMode])

  const onMouseUpHandler = useCallback(e => {
    console.log('up ====')
    setResizeMode(false)
    resizeModeStartCoordinate.current = null
    resizeModeStartNodeLayout.current = null
  }, [])

  const onMouseMoveHandler = useCallback(e => {
    const { clientX, clientY }  = e
    if (!resizeMode) return

    const {
      clientX: oldClientX,
      clientY: oldClientY,
    } = resizeModeStartCoordinate.current

    // if positive, means amplify
    // if negative, means narrow

    let deltaX
    let nextWidth

    if (leftBarVisible) {
      deltaX = oldClientX - clientX
    } else {
      deltaX = clientX - oldClientX
    }

    // 只有当时居中的时候，width的变化需要是滑动距离的两倍
    if (alignment === 'center') {
      nextWidth = `${resizeModeStartNodeLayout.current.width + deltaX * 2}px`
    } else {
      nextWidth = `${resizeModeStartNodeLayout.current.width + deltaX}px`
    }

    const node = document.querySelector(
      `[data-offset-key="${dataOffsetKey}"]`
    )

    node.style.width = nextWidth
  }, [resizeMode, alignment, leftBarVisible, rightBarVisible])

  const onMouseEnterLeftHandler = useCallback(e => {
    e.preventDefault()
    if (!leftBarVisible) { setLeftBarVisible(true) }
  }, [leftBarVisible])

  const onMouseEnterRightHandler = useCallback(e => {
    e.preventDefault()
    if (!rightBarVisible) { setRightBarVisible(true)}
  }, [rightBarVisible])

  const onMouseLeaveLeftHandler = useCallback(e => {
    e.preventDefault()
    if (leftBarVisible) { setLeftBarVisible(false) }
  }, [leftBarVisible])

  const onMouseLeaveRightHandler = useCallback(e => {
    e.preventDefault()
    if (rightBarVisible) { setRightBarVisible(false) }
  }, [rightBarVisible])

  return (
    <div onMouseDown={onMouseDownHandler} className="resizable-component">
      <LeftBar
        visible={leftBarVisible}
        resizeMode={resizeMode}
        onMouseEnterHandler={onMouseEnterLeftHandler}
        onMouseLeaveHandler={onMouseLeaveLeftHandler}
      />
      <WrappedComponent {...props} />
      <RightBar
        visible={rightBarVisible}
        resizeMode={resizeMode}
        onMouseEnterHandler={onMouseEnterRightHandler}
        onMouseLeaveHandler={onMouseLeaveRightHandler}
      />
    </div>
  )
}

export default Resizable

