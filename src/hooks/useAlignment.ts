import { useCallback, useEffect, useRef } from 'react';
import getRootNode from '../utils/rect/getRootNode';
import clamp from '../helpers/clamp';
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

  const onMouseEnterHandler = useCallback((e: Event) => {
    attemptToClearTimeoutHandler();

    e.stopPropagation();
    const rootNode = getRootNode(editorRef);

    if (!rootNode) return;
    if (isToolbarVisibleRef.current) return;
    showToolbar();
  });

  const onMouseLeaveHandler = useCallback((e: Event) => {
    e.stopPropagation();
    if (!isToolbarVisibleRef.current) return;
    hideToolbar();
  });

  const showToolbar = useCallback(() => {
    const rootNode = getRootNode(editorRef) as HTMLElement;
    const nodeRect = nodeRef.current!.getBoundingClientRect();

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

    // TODO ------
    const { offsetLeft } = rootNode;
    // const { offsetRight } = rootNode;

    // 考虑到left的最小和最大值的边界
    const minLeft = 0;
    const maxLeft = offsetLeft - alignmentBarRef.current!.offsetWidth;
    const tmpLeft = left - alignmentToolbarWidth / 2 + width / 2;

    const nextLeft = clamp(tmpLeft, minLeft, maxLeft);

    alignmentBarRef.current!.style.top = `${nextTop}px`;
    alignmentBarRef.current!.style.left = `${nextLeft}px`;

    if (alignmentBarEventRemoverRef.current)
      alignmentBarEventRemoverRef.current();

    alignmentBarRef.current!.addEventListener(
      'mouseenter',
      onMouseEnterHandler
    );
    alignmentBarRef.current!.addEventListener(
      'mouseleave',
      onMouseLeaveHandler
    );

    alignmentBarEventRemoverRef.current = () => {
      alignmentBarRef.current!.removeEventListener(
        'mouseenter',
        onMouseEnterHandler
      );
      alignmentBarRef.current!.removeEventListener(
        'mouseleave',
        onMouseLeaveHandler
      );
    };
  }, [
    block,
    editorRef,
    hooks.toggleImageToolbarVisible,
    nodeRef,
    onMouseEnterHandler,
    onMouseLeaveHandler,
  ]);

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
    nodeRef.current!.addEventListener('mouseenter', onMouseEnterHandler);
    // TODO: should fix...when resize component...mouseleave may not trigger...
    nodeRef.current!.addEventListener('mouseleave', onMouseLeaveHandler);

    if (mouseEnterRemoverRef.current) mouseEnterRemoverRef.current();
    mouseEnterRemoverRef.current = () => {
      nodeRef.current!.removeEventListener('mouseenter', onMouseEnterHandler);
      nodeRef.current!.removeEventListener('mouseleave', onMouseLeaveHandler);
      mouseEnterRemoverRef.current = null;
    };
    return mouseEnterRemoverRef.current;
  }, [nodeRef, onMouseEnterHandler, onMouseLeaveHandler]);
};

export default useAlignment;
