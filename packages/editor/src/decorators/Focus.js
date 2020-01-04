import React, { useCallback, useRef, useState, useEffect } from 'react'
import setSelectionToBlock from '../utils/setSelectionToBlock'

const Focus = WrappedComponent => props => {
  const { blockProps, block } = props
  const { getEditor, isFocused } = blockProps
  const { editorState, hooks } = getEditor()
  const isMounted = useRef(false)
  const prevIsFocused = useRef(isFocused)
  const [focused, setFocus] = useState(isFocused)

  const focusStyle = useRef({
    boxShadow: '0 0 0 3px #03a87c',
  })

  useEffect(() => {
    isMounted.current = true
    return () => isMounted.current = false
  }, [])

  useEffect(() => {
    if (!isMounted.current) return

    if (isFocused !== prevIsFocused.current) {
      setFocus(isFocused)
    }
    prevIsFocused.current = isFocused
  }, [isFocused])

  useEffect(() => {
    hooks.onSelectionBlur.tap('Focus', () => {
      if (focused) {
        setFocus(false)
      }
    })
  }, [focused])

  // 对于`Focusable` component, 当被点击的时候，`EditorState`的selection应该指向当前的
  // block
  const handleClick = useCallback(() => {
    // 如果已经被选中，再次点击不再触发handler
    if (focused) return
    const newEditorState = setSelectionToBlock(editorState, block)
    hooks.setState.call(newEditorState)
  }, [block, editorState, focused])

  return (
    <div onClick={handleClick} style={focused ? focusStyle.current : {}}>
      <WrappedComponent {...props} />
    </div>
  )
}

export default Focus