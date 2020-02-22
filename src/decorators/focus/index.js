import React, { useCallback, useRef, useState, useEffect } from "react";
import setSelectionToBlock from "../../utils/setSelectionToBlock";
import "./styles.css";

const Focus = WrappedComponent => props => {
  const { blockProps, block } = props;
  const { getEditor } = blockProps;
  const { hooks } = getEditor();
  const isMounted = useRef(false);
  const [focused, setFocus] = useState(false);
  const focusedRef = useRef(false);
  const currentBlockKey = block.getKey();
  const timeoutHandler = useRef();

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  const setState = useCallback(falsy => {
    setFocus(falsy);
    focusedRef.current = falsy;
  }, []);

  const delaySetState = useCallback(falsy => {
    clearTimeout(timeoutHandler.current);
    timeoutHandler.current = setTimeout(() => setState(falsy), 50);
  });

  useEffect(() => {
    hooks.selectionCollapsedChange.tap("Focus", (editorState, payload) => {
      const {
        newValue: { isCollapsed, selection }
      } = payload;
      const startKey = selection.getStartKey();
      if (isCollapsed && startKey === currentBlockKey && !focusedRef.current) {
        delaySetState(true);
        return;
      }
      if (!isCollapsed && focusedRef.current) {
        delaySetState(false);
        return;
      }
    });

    hooks.selectionMoveOuterBlock.tap("Focus", (editorState, payload) => {
      const {
        newValue: { selection }
      } = payload;
      const startKey = selection.getStartKey();
      if (startKey === currentBlockKey && !focusedRef.current) {
        delaySetState(true);
        return;
      }
      if (startKey !== currentBlockKey && focusedRef.current) {
        delaySetState(false);
        return;
      }
    });
  }, []);

  // 对于`Focusable` component, 当被点击的时候，`EditorState`的selection应该指向当前的
  // block
  const handleClick = useCallback(() => {
    // 如果已经被选中，再次点击不再触发handler
    // pay attention, editorState should use the latest value
    const { editorState } = getEditor();
    const newEditorState = setSelectionToBlock(editorState, block);
    hooks.setState.call(newEditorState);
  }, [block]);

  const className = focused ? "focused_atomic_active" : "focused_atomic";

  return (
    <div onClick={handleClick} className={className}>
      <WrappedComponent {...props} />
    </div>
  );
};

export default Focus;
