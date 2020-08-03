import { useCallback, useEffect, useRef } from 'react';
import getRootNode from '../utils/rect/getRootNode';
import { HooksProps } from '../types';

const useAlignment = ({ nodeRef, props }: HooksProps) => {
  const alignmentBarRef = useRef(
    document.querySelector('.image-toolbar') as HTMLElement
  );
  const mouseEnterRemoverRef = useRef<{ (): void } | null>(() => {});
  const alignmentBarEventRemoverRef = useRef(() => {});
  const hideBarTimeoutHandler = useRef<NodeJS.Timeout | undefined | null>();
  const isToolbarVisibleRef = useRef(false);
  const { blockProps, block } = props;
  const { getEditor } = blockProps;
  const { editorRef, hooks } = getEditor();

  const attemptToClearTimeoutHandler = useCallback(() => {
    if (hideBarTimeoutHandler.current)
      clearTimeout(hideBarTimeoutHandler.current);
    hideBarTimeoutHandler.current = null;
  }, []);

  // clean up event handler on un-mount component.
  const teardown = useCallback(() => {
    attemptToClearTimeoutHandler();
    if (mouseEnterRemoverRef.current) mouseEnterRemoverRef.current();
    if (alignmentBarEventRemoverRef.current)
      alignmentBarEventRemoverRef.current();
  }, [attemptToClearTimeoutHandler]);
  // teardown on un-mount
  useEffect(() => () => teardown(), [teardown]);

  const onMouseEnterHandler = useRef((e: Event) => {
    attemptToClearTimeoutHandler();

    e.stopPropagation();
    const rootNode = getRootNode(editorRef);

    if (!rootNode) return;
    if (isToolbarVisibleRef.current) return;
    if (typeof showToolbar === 'function') showToolbar();
  });

  const onMouseLeaveHandler = useRef((e: Event) => {
    e.stopPropagation();
    if (!isToolbarVisibleRef.current) return;
    if (typeof hideToolbar === 'function') hideToolbar();
  });

  const showToolbar = useCallback(() => {
    const rootNode = getRootNode(editorRef) as HTMLElement;
    if (!nodeRef.current) return;

    const nodeRect = nodeRef.current.getBoundingClientRect();

    const rootOffsetTop = rootNode.offsetTop;
    const rootOffsetLeft = rootNode.offsetLeft;
    const { width } = nodeRect;
    const rootRect = rootNode.getBoundingClientRect();
    const top = rootOffsetTop + nodeRect.top - rootRect.top;
    const left = rootOffsetLeft + nodeRect.left - rootRect.left;

    alignmentBarRef.current!.style.display = 'block';
    alignmentBarRef.current!.style.visibility = 'visible';
    isToolbarVisibleRef.current = true;
    hooks.toggleImageToolbarVisible.call(true, block);

    const alignmentToolbarHeight = alignmentBarRef.current!.offsetHeight;
    const alignmentToolbarWidth = alignmentBarRef.current!.offsetWidth;
    const nextTop = top - alignmentToolbarHeight - 15;

    // 考虑到left的最小和最大值的边界
    const tmpLeft = left - alignmentToolbarWidth / 2 + width / 2;

    const nextLeft = Math.max(0, tmpLeft);

    alignmentBarRef.current!.style.top = `${nextTop}px`;
    alignmentBarRef.current!.style.left = `${nextLeft}px`;

    if (alignmentBarEventRemoverRef.current)
      alignmentBarEventRemoverRef.current();

    alignmentBarRef.current!.addEventListener(
      'mouseenter',
      onMouseEnterHandler.current
    );
    alignmentBarRef.current!.addEventListener(
      'mouseleave',
      onMouseLeaveHandler.current
    );

    alignmentBarEventRemoverRef.current = () => {
      alignmentBarRef.current!.removeEventListener(
        'mouseenter',
        onMouseEnterHandler.current
      );
      alignmentBarRef.current!.removeEventListener(
        'mouseleave',
        onMouseLeaveHandler.current
      );
    };
  }, [block, editorRef, hooks.toggleImageToolbarVisible, nodeRef]);

  const hideToolbar = useCallback(() => {
    hideBarTimeoutHandler.current = setTimeout(() => {
      alignmentBarRef.current!.style.display = 'none';
      alignmentBarRef.current!.style.visibility = 'invisible';
      isToolbarVisibleRef.current = false;
      hooks.toggleImageToolbarVisible.call(false, block);
      attemptToClearTimeoutHandler();
    }, 100);
  }, [attemptToClearTimeoutHandler, block, hooks.toggleImageToolbarVisible]);

  // To make nodeRef react to `mouseenter` and `mouseleave` event.
  useEffect((): { (): void } => {
    if (nodeRef.current) {
      nodeRef.current.addEventListener(
        'mouseenter',
        onMouseEnterHandler.current
      );
      // TODO: should fix...when resize component...mouseleave may not trigger...
      nodeRef.current.addEventListener(
        'mouseleave',
        onMouseLeaveHandler.current
      );

      mouseEnterRemoverRef.current = () => {
        if (nodeRef.current) {
          nodeRef.current.removeEventListener(
            'mouseenter',
            onMouseEnterHandler.current
          );
          nodeRef.current.removeEventListener(
            'mouseleave',
            onMouseLeaveHandler.current
          );
        }
        mouseEnterRemoverRef.current = null;
      };
      return mouseEnterRemoverRef.current;
    }

    return () => {};
  }, [nodeRef, onMouseEnterHandler, onMouseLeaveHandler]);
};

export default useAlignment;
