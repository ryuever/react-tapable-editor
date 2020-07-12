import { useCallback, useRef, useState, useEffect } from 'react';
// @ts-ignore
import setSelectionToBlock from '../utils/setSelectionToBlock';
import './styles/useFocus.css';
import { HooksProps } from '../types';

const useFocus = ({ nodeRef, props }: HooksProps) => {
  const { blockProps, block } = props;
  const { getEditor } = blockProps;
  const { hooks } = getEditor();
  const [focused, setFocus] = useState(false);
  const focusedRef = useRef(false);
  const currentBlockKey = block.getKey();
  const timeoutHandler = useRef<NodeJS.Timeout | null | undefined>();
  const setState = useCallback(falsy => {
    setFocus(falsy);
    focusedRef.current = falsy;
  }, []);
  const isMounted = useRef(false);

  // TODO: tapable could not be clear on unmount...
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const delaySetState = useCallback(
    falsy => {
      if (timeoutHandler.current) clearTimeout(timeoutHandler.current);
      timeoutHandler.current = setTimeout(() => setState(falsy), 50);
    },
    [setState]
  );

  // TODO: pending on fix clear up...
  useEffect(() => {
    hooks.selectionCollapsedChange.tap('Focus', (_, payload) => {
      if (!isMounted.current) return;
      const {
        newValue: { isCollapsed, selection },
      } = payload;
      const startKey = selection.getStartKey();
      if (isCollapsed && startKey === currentBlockKey && !focusedRef.current) {
        delaySetState(true);
        return;
      }
      if (!isCollapsed && focusedRef.current) {
        delaySetState(false);
      }
    });

    hooks.selectionMoveOuterBlock.tap('Focus', (_, payload) => {
      if (!isMounted.current) return;
      const {
        newValue: { selection },
      } = payload;
      const startKey = selection.getStartKey();
      if (startKey === currentBlockKey && !focusedRef.current) {
        delaySetState(true);
        return;
      }
      if (startKey !== currentBlockKey && focusedRef.current) {
        delaySetState(false);
      }
    });
  }, [
    currentBlockKey,
    delaySetState,
    hooks.selectionCollapsedChange,
    hooks.selectionMoveOuterBlock,
  ]);

  // 对于`Focusable` component, 当被点击的时候，`EditorState`的selection应该指向当前的
  // block
  const handleClick = useCallback(() => {
    // 如果已经被选中，再次点击不再触发handler
    // pay attention, editorState should use the latest value
    const { editorState } = getEditor();
    const newEditorState = setSelectionToBlock(editorState, block);
    hooks.setState.call(newEditorState);
  }, [block, getEditor, hooks.setState]);

  useEffect(() => {
    nodeRef.current!.addEventListener('click', handleClick);
    return () => {
      nodeRef.current!.removeEventListener('click', handleClick);
    };
  }, [handleClick, nodeRef]);

  // update className after all
  useEffect(() => {
    if (focused) {
      nodeRef.current!.classList.remove('focused_atomic');
      nodeRef.current!.classList.add('focused_atomic_active');
    } else {
      nodeRef.current!.classList.remove('focused_atomic_active');
      nodeRef.current!.classList.add('focused_atomic');
    }
  }, [focused, nodeRef]);
};

export default useFocus;
