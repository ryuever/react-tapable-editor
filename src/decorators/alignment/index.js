import React, { useCallback, useEffect, useRef } from 'react'
import getRootNode from '../../utils/rect/getRootNode'
import clamp from '../../helpers/clamp'

import './styles.css'

const Alignment = WrappedComponent => props => {
  const { blockProps: { getEditor }, block} = props
  const { editorRef, hooks } = getEditor()
  const isToolbarVisible = useRef(false)
  const timeoutHandler = useRef()

  const showToolbar = useCallback(node => {
    const rootNode = getRootNode(editorRef)
    const nodeRect = node.getBoundingClientRect()

    const alignmentToolbar = document.querySelector('.image-toolbar')

    document.addEventListener('mouseover', eventHandler)
    alignmentToolbar.addEventListener('mouseleave', onMouseLeaveHandler)

    const rootOffsetTop = rootNode.offsetTop
    const rootOffsetLeft = rootNode.offsetLeft
    const { width } = nodeRect
    const rootRect = rootNode.getBoundingClientRect()
    const top = rootOffsetTop + nodeRect.top - rootRect.top
    const left = rootOffsetLeft + nodeRect.left - rootRect.left

    alignmentToolbar.style.display = 'block'
    alignmentToolbar.style.visibility = 'visible'
    isToolbarVisible.current = true
    hooks.toggleImageToolbarVisible.call(true, block)

    const alignmentToolbarHeight = alignmentToolbar.offsetHeight
    const alignmentToolbarWidth = alignmentToolbar.offsetWidth
    const nextTop = top - alignmentToolbarHeight - 15
    const offsetRight = rootNode.offsetRight

    // 考虑到left的最小和最大值的边界
    const minLeft = 0
    const maxLeft = offsetRight - alignmentToolbar.offsetWidth
    const tmpLeft = left - alignmentToolbarWidth / 2 + width / 2

    const nextLeft = clamp(tmpLeft, minLeft, maxLeft)

    alignmentToolbar.style.top = `${nextTop}px`
    alignmentToolbar.style.left = `${nextLeft}px`
  })

  const hideToolbar = useCallback(() => {
    timeoutHandler.current = setTimeout(() => {
      const alignmentToolbar = document.querySelector('.image-toolbar')

      alignmentToolbar.style.display = 'none'
      alignmentToolbar.style.visibility = 'invisible'
      isToolbarVisible.current = false
      hooks.toggleImageToolbarVisible.call(false, block)

      timeoutHandler.current = null
      document.removeEventListener('mouseover', eventHandler)
      alignmentToolbar.removeEventListener('mouseleave', onMouseLeaveHandler)
    }, 100)
  })

  const onMouseEnterHandler = useCallback(e => {
    e.stopPropagation()
    const node = e.currentTarget
    const rootNode = getRootNode(editorRef)
    if (timeoutHandler.current) {
      clearTimeout(timeoutHandler.current)
      timeoutHandler.current = null
    }

    if (!rootNode) return
    if (isToolbarVisible.current) return
    showToolbar(node)
  }, [])

  const onMouseLeaveHandler = useCallback(e => {
    e.stopPropagation()
    if (!isToolbarVisible.current) return
    hideToolbar()
  }, [])

  const eventHandler = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.target
    const alignmentToolbar = document.querySelector('.image-toolbar')

    if (alignmentToolbar.contains(target) && timeoutHandler.current) {
      clearTimeout(timeoutHandler.current)
      timeoutHandler.current = null
    }
  }, [])

  return (
    <div onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler} className="alignment">
      <WrappedComponent {...props} />
    </div>
  )
}

export default Alignment