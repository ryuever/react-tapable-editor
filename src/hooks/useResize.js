// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove
// https://media.prod.mdn.mozit.cloud/attachments/2013/03/05/5031/5692db994e59bae0b1c9e66f7df259b9/draggable_elements.html

import React, { useCallback, useState, useRef, useEffect } from "react";
import { EditorState } from "draft-js";
import { generateOffsetKey } from "../utils/keyHelper";

import "./styles/useResize.css";

// const LeftBar = React.memo(
//   props => {
//     const {
//       visible,
//       resizeMode,
//       onMouseEnterHandler,
//       onMouseLeaveHandler
//     } = props;

//     const shouldRender = visible || resizeMode;
//     return (
//       <div
//         className="bar-left"
//         onMouseEnter={onMouseEnterHandler}
//         onMouseLeave={onMouseLeaveHandler}
//       >
//         {shouldRender && <div className="bar" />}
//       </div>
//     );
//   },
//   (prev, next) =>
//     prev.visible === next.visible && prev.resizeMode === next.resizeMode
// );

// const RightBar = React.memo(
//   props => {
//     const {
//       visible,
//       resizeMode,
//       onMouseEnterHandler,
//       onMouseLeaveHandler
//     } = props;
//     const shouldRender = visible || resizeMode;
//     return (
//       <div
//         className="bar-right"
//         onMouseEnter={onMouseEnterHandler}
//         onMouseLeave={onMouseLeaveHandler}
//       >
//         {shouldRender && <div className="bar" />}
//       </div>
//     );
//   },
//   (prev, next) =>
//     prev.visible === next.visible && prev.resizeMode === next.resizeMode
// );

const useResize = ({ nodeRef, props }) => {
  const [leftBarVisible, setLeftBarVisible] = useState(false);
  const [rightBarVisible, setRightBarVisible] = useState(false);
  const [resizeMode, setResizeMode] = useState(false);
  const { block, blockProps } = props;
  const { alignment, resizeLayout, getEditor } = blockProps;
  const blockKey = block.getKey();
  const dataOffsetKey = generateOffsetKey(blockKey);
  const nextWidth = useRef();
  const coordinate = useRef();
  const layout = useRef();

  const leftBarRef = useRef();
  const rightBarRef = useRef();

  const mouseMoveTeardown = useRef();
  const resizeModeRef = useRef();

  useEffect(() => {
    // create a bar and append to nodeRef
    const leftNode = document.createElement("div");
    leftNode.classList.add("left-bar-wrapper");
    const leftBar = document.createElement("div");
    leftBar.classList.add("bar");
    leftNode.appendChild(leftBar);
    leftBarRef.current = leftNode;

    const rightNode = document.createElement("div");
    rightNode.classList.add("right-bar-wrapper");
    const rightBar = document.createElement("div");
    rightBar.classList.add("bar");
    rightNode.appendChild(rightBar);
    rightBarRef.current = rightNode;

    nodeRef.current.appendChild(leftBarRef.current);
    nodeRef.current.appendChild(rightBarRef.current);
    nodeRef.current.classList.add("resizable-component");
  }, []);

  // make resize bar visible when enter into container...
  const onMouseEnterContainer = useCallback(() => {
    leftBarRef.current.classList.add("bar-visible");
    rightBarRef.current.classList.add("bar-visible");
  }, []);
  const onMouseLeaveContainer = useCallback(() => {
    leftBarRef.current.classList.remove("bar-visible");
    rightBarRef.current.classList.remove("bar-visible");
  }, []);

  useEffect(() => {
    nodeRef.current.addEventListener("mouseenter", onMouseEnterContainer);
    nodeRef.current.addEventListener("mouseleave", onMouseLeaveContainer);

    return () => {
      nodeRef.current.removeEventListener("mouseenter", onMouseEnterContainer);
      nodeRef.current.removeEventListener("mouseleave", onMouseLeaveContainer);
    };
  }, []);

  const onMouseDownHandler = useCallback(e => {
    // setResizeMode(true);
    resizeModeRef.current = true;
    const { clientX, clientY, currentTarget } = e;
    const { offsetWidth, offsetHeight } = nodeRef.current;

    coordinate.current = {
      clientX,
      clientY
    };
    layout.current = {
      width: offsetWidth,
      height: offsetHeight
    };

    document.addEventListener("mousemove", onMouseMoveHandler);
  }, []);

  useEffect(() => {
    leftBarRef.current.addEventListener("mousedown", onMouseDownHandler);
    rightBarRef.current.addEventListener("mousedown", onMouseDownHandler);

    return () => {
      leftBarRef.current.removeEventListener("mousedown", onMouseDownHandler);
      rightBarRef.current.removeEventListener("mousedown", onMouseDownHandler);
    };
  }, []);

  const onMouseMoveHandler = useCallback(
    e => {
      const { clientX, clientY } = e;
      if (!resizeModeRef.current) return;

      const { clientX: oldClientX, clientY: oldClientY } = coordinate.current;

      let deltaX;

      if (leftBarVisible) {
        deltaX = oldClientX - clientX;
      } else {
        deltaX = clientX - oldClientX;
      }

      // 只有当时居中的时候，width的变化需要是滑动距离的两倍
      if (alignment === "center") {
        nextWidth.current = `${layout.current.width + deltaX * 2}px`;
      } else {
        nextWidth.current = `${layout.current.width + deltaX}px`;
      }
      console.log("value ", nextWidth.current, deltaX, layout.current.width);
      nodeRef.current.style.width = nextWidth.current;

      // const node = document.querySelector(
      //   `[data-offset-key="${dataOffsetKey}"]`
      // );
      // node.style.width = nextWidth.current;
    },
    [resizeMode, alignment, leftBarVisible, rightBarVisible]
  );
};

export default useResize;
