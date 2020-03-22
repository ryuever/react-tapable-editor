import { EditorState } from "draft-js";
import throttle from "../utils/throttle";
import getBoundingRectWithSafeArea from "../utils/rect/getBoundingRectWithSafeArea";
import findBlockContainsPoint from "../utils/rect/findBlockContainsPoint";
import getRootNode from "../utils/rect/getRootNode";

function SingletonSidebarPlugin() {
  let currentBlockInfoWithSidebar = null;

  this.apply = getEditor => {
    const { hooks, editorRef, sidebarRef } = getEditor();

    const mouseMoveHandler = e => {
      const { editorState } = getEditor();
      const coordinateMap = getBoundingRectWithSafeArea(editorState);
      const x = e.pageX;
      const y = e.pageY;

      const nodeInfo = findBlockContainsPoint(coordinateMap, { x, y });

      if (nodeInfo) {
        const { rect } = nodeInfo;
        currentBlockInfoWithSidebar = nodeInfo;
        const { top, left } = rect;

        const rootNode = getRootNode(editorRef);
        const rootRect = rootNode.getBoundingClientRect();
        const rootOffsetTop = rootNode.offsetTop;
        const rootOffsetLeft = rootNode.offsetLeft;

        const nextTop = rootOffsetTop + top - rootRect.top;
        const nextLeft = left + 100 - 50;

        sidebarRef.current.style.opacity = 1;
        sidebarRef.current.style.top = `${nextTop}px`;
        sidebarRef.current.style.left = `${nextLeft}px`;
      }
    };
    const keyDownHandler = e => {
      if (!currentBlockInfoWithSidebar) return;
      sidebarRef.current.style.opacity = 0;
      currentBlockInfoWithSidebar = null;
    };

    const throttledMoveHandler = throttle(mouseMoveHandler, 50);
    const throttledKeyDownHandler = throttle(keyDownHandler, 50);
    document.addEventListener("mousemove", throttledMoveHandler);
    document.addEventListener("keydown", throttledKeyDownHandler);
  };
}

export default SingletonSidebarPlugin;
