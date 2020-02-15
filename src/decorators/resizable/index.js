// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove
// https://media.prod.mdn.mozit.cloud/attachments/2013/03/05/5031/5692db994e59bae0b1c9e66f7df259b9/draggable_elements.html

import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react'
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey'
import { EditorState } from 'draft-js'
import './styles.css'

const LeftBar = React.memo(props => {
  const {
    visible,
    resizeMode,
    onMouseEnterHandler,
    onMouseLeaveHandler,
  } = props

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
  const { alignment, resizeLayout, getEditor, node } = blockProps
  const blockKey = block.getKey()
  const dataOffsetKey = DraftOffsetKey.encode(blockKey, 0, 0)
  const nextWidth = useRef()
  const resizeRef = useRef()

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

  useEffect(() => {
    const node = document.querySelector(
      `[data-offset-key="${dataOffsetKey}"]`
    )
    node.style.width = resizeLayout.width
  }, [])

  const onMouseUpHandler = useCallback(e => {
    setResizeMode(false)
    resizeModeStartCoordinate.current = null
    resizeModeStartNodeLayout.current = null

    const { editorState, hooks } = getEditor()
    if (nextWidth.current) {
      const contentState = editorState.getCurrentContent()
      const entityKey = block.getEntityAt(0)
      const newContent = contentState.mergeEntityData(entityKey, {
        resizeLayout: {
          width: nextWidth.current,
        }
      });
      const nextState = EditorState.push(editorState, newContent)
      hooks.setState.call(nextState)
    }
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

    if (leftBarVisible) {
      deltaX = oldClientX - clientX
    } else {
      deltaX = clientX - oldClientX
    }

    // 只有当时居中的时候，width的变化需要是滑动距离的两倍
    if (alignment === 'center') {
      nextWidth.current = `${resizeModeStartNodeLayout.current.width + deltaX * 2}px`
    } else {
      nextWidth.current = `${resizeModeStartNodeLayout.current.width + deltaX}px`
    }

    const node = document.querySelector(
      `[data-offset-key="${dataOffsetKey}"]`
    )
    // resizeRef.current.style.width = nextWidth.current
    node.style.width = nextWidth.current
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
    <div
      onMouseDown={onMouseDownHandler}
      className="resizable-component"
      ref={resizeRef}
    >
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

