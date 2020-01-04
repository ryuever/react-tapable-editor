import React, { useCallback, useRef, useState, useEffect } from 'react'
import setSelectionToBlock from '../utils/setSelectionToBlock'

const Focus = WrappedComponent => props => {
  const { blockProps, block } = props
  const { getEditor } = blockProps
  const { editorState, hooks } = getEditor()
  const isMounted = useRef(false)
  const [focused, setFocus] = useState(false)
  const focusedRef = useRef(false)
  const currentBlockKey = block.getKey()
  const payloadRef = useRef()

  const focusStyle = useRef({
    boxShadow: '0 0 0 3px #03a87c',
  })

  useEffect(() => {
    isMounted.current = true
    return () => isMounted.current = false
  }, [])

  const setState = useCallback(falsy => {
    setFocus(falsy)
    focusedRef.current = falsy
  }, [])

  useEffect(() => {
    hooks.onBlockSelectionChange.tap('Focus', (editorState, payload) => {
      payloadRef.current = payload

      // TODO：之所以这里面通过setTimeout的方式来触发，是因为在用户
      setTimeout(() => {
        if (!isMounted.current) return

        const { type, newValue } = payloadRef.current

        if (type === 'isCollapsed-change') {
          if (newValue.isCollapsed && newValue.startKey === currentBlockKey && !focusedRef.current) {
            setState(true)
            return
          }
          if (!newValue.isCollapsed && focusedRef.current) {
            setState(false)
            return
          }
          return
        }

        if (type === 'start-key-change') {
          if (newValue.startKey === currentBlockKey) {
            if (newValue.hasFocus && !focusedRef.current) {
              setState(true)
              return
            }
            if (!newValue.hasFocus && focusedRef.current) {
              setState(false)
              return
            }
          }
          if (newValue.startKey !== currentBlockKey && focusedRef.current) {
            setState(false)
            return
          }
        }
      }, 50)
    })
  }, [])

  // 对于`Focusable` component, 当被点击的时候，`EditorState`的selection应该指向当前的
  // block
  const handleClick = useCallback(() => {
    // 如果已经被选中，再次点击不再触发handler
    const newEditorState = setSelectionToBlock(editorState, block)
    hooks.setState.call(newEditorState)
  }, [block, editorState])

  return (
    <div onClick={handleClick} style={focused ? focusStyle.current : {}}>
      <WrappedComponent {...props} />
    </div>
  )
}

export default Focus