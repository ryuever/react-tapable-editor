import { useCallback, useEffect, useRef } from "react";
import getRootNode from "../utils/rect/getRootNode";
import clamp from "../helpers/clamp";

const useAlignment = ({ nodeRef, props }) => {
  const alignmentBarRef = useRef(document.querySelector(".image-toolbar"));
  const mouseEnterRemoverRef = useRef(() => {});
  const alignmentBarEventRemoverRef = useRef(() => {});
  const hideBarTimeoutHandler = useRef();
  const isToolbarVisibleRef = useRef(false);
  const { blockProps, block } = props;
  const { getEditor } = blockProps;
  const { editorRef, hooks } = getEditor();

  // clean up event handler on un-mount component.
  const teardown = useCallback(() => {
    attemptToClearTimeoutHandler();
    if (mouseEnterRemoverRef.current) mouseEnterRemoverRef.current();
    if (alignmentBarEventRemoverRef.current)
      alignmentBarEventRemoverRef.current();
  }, []);
  useEffect(() => () => teardown());

  const attemptToClearTimeoutHandler = useCallback(() => {
    if (hideBarTimeoutHandler.current)
      clearTimeout(hideBarTimeoutHandler.current);
    hideBarTimeoutHandler.current = null;
  }, []);

  const onMouseEnterHandler = useCallback(e => {
    attemptToClearTimeoutHandler();

    e.stopPropagation();
    const rootNode = getRootNode(editorRef);

    if (!rootNode) return;
    if (isToolbarVisibleRef.current) return;
    showToolbar();
  }, []);

  const onMouseLeaveHandler = useCallback(e => {
    e.stopPropagation();
    if (!isToolbarVisibleRef.current) return;
    hideToolbar();
  }, []);

  // To make nodeRef react to `mouseenter` and `mouseleave` event.
  useEffect(() => {
    nodeRef.current.addEventListener("mouseenter", onMouseEnterHandler);
    nodeRef.current.addEventListener("mouseleave", onMouseLeaveHandler);

    if (mouseEnterRemoverRef.current) mouseEnterRemoverRef.current();
    mouseEnterRemoverRef.current = () => {
      nodeRef.current.removeEventListener("mouseenter", onMouseEnterHandler);
      nodeRef.current.removeEventListener("mouseleave", onMouseLeaveHandler);
      mouseEnterRemoverRef.current = null;
    };
    return mouseEnterRemoverRef.current;
  }, []);

  const showToolbar = useCallback(() => {
    const rootNode = getRootNode(editorRef);
    const nodeRect = nodeRef.current.getBoundingClientRect();

    const rootOffsetTop = rootNode.offsetTop;
    const rootOffsetLeft = rootNode.offsetLeft;
    const { width } = nodeRect;
    const rootRect = rootNode.getBoundingClientRect();
    const top = rootOffsetTop + nodeRect.top - rootRect.top;
    const left = rootOffsetLeft + nodeRect.left - rootRect.left;

    alignmentBarRef.current.style.display = "block";
    alignmentBarRef.current.style.visibility = "visible";
    isToolbarVisibleRef.current = true;
    hooks.toggleImageToolbarVisible.call(true, block);

    const alignmentToolbarHeight = alignmentBarRef.current.offsetHeight;
    const alignmentToolbarWidth = alignmentBarRef.current.offsetWidth;
    const nextTop = top - alignmentToolbarHeight - 15;
    const { offsetRight } = rootNode;

    // 考虑到left的最小和最大值的边界
    const minLeft = 0;
    const maxLeft = offsetRight - alignmentBarRef.current.offsetWidth;
    const tmpLeft = left - alignmentToolbarWidth / 2 + width / 2;

    const nextLeft = clamp(tmpLeft, minLeft, maxLeft);

    alignmentBarRef.current.style.top = `${nextTop}px`;
    alignmentBarRef.current.style.left = `${nextLeft}px`;

    if (alignmentBarEventRemoverRef.current)
      alignmentBarEventRemoverRef.current();

    alignmentBarRef.current.addEventListener("mouseenter", onMouseEnterHandler);
    alignmentBarRef.current.addEventListener("mouseleave", onMouseLeaveHandler);

    alignmentBarEventRemoverRef.current = () => {
      alignmentBarRef.current.removeEventListener(
        "mouseenter",
        onMouseEnterHandler
      );
      alignmentBarRef.current.removeEventListener(
        "mouseleave",
        onMouseLeaveHandler
      );
    };
  });

  const hideToolbar = useCallback(() => {
    hideBarTimeoutHandler.current = setTimeout(() => {
      alignmentBarRef.current.style.display = "none";
      alignmentBarRef.current.style.visibility = "invisible";
      isToolbarVisibleRef.current = false;
      hooks.toggleImageToolbarVisible.call(false, block);
      attemptToClearTimeoutHandler();
    }, 100);
  });
};

export default useAlignment;
