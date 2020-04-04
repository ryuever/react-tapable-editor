// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove
// https://media.prod.mdn.mozit.cloud/attachments/2013/03/05/5031/5692db994e59bae0b1c9e66f7df259b9/draggable_elements.html

import React, { useCallback, useState, useRef, useEffect } from "react";
import { EditorState } from "draft-js";
import { generateOffsetKey } from "../utils/keyHelper";
import "./styles/useResize.css";

/**
 *
 * @param {HTMLElement} nodeRef
 * @param {Object} props
 *
 * when calculate nextWidth value, `alignment` param will be a significant factor...
 *   1. alignment value is left.. Moving to left direction is allowed.
 *   2. alignment value is right.. Moving to right direction is allowed.
 *   3. alignment value is center.. Moving to both directions is allowed.
 */

const useResize = ({ nodeRef, props }) => {
  console.log("xxxx", nodeRef.current);

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
  const rightToStretchRef = useRef();

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

  const resolveAlignment = useCallback(() => {
    return "center";
  }, []);

  const prepareAfterMouseDown = event => {
    resizeModeRef.current = true;
    const { clientX, clientY } = event;
    const { offsetWidth, offsetHeight } = nodeRef.current;

    coordinate.current = { clientX, clientY };
    layout.current = {
      width: offsetWidth,
      height: offsetHeight
    };

    document.addEventListener("mousemove", onMouseMoveHandler);

    if (mouseMoveTeardown.current) {
      mouseMoveTeardown.current();
    }

    mouseMoveTeardown.current = () => {
      document.removeEventListener("mousemove", onMouseMoveHandler);
      mouseMoveTeardown.current = null;
    };
  };

  const onMouseDownLeftHandler = useCallback(event => {
    prepareAfterMouseDown(event);
    rightToStretchRef.current = false;
  }, []);

  const onMouseDownRightHandler = useCallback(event => {
    prepareAfterMouseDown(event);
    rightToStretchRef.current = true;
  }, []);

  const onMouseUpHandler = useCallback(e => {
    resizeModeRef.current = false;
    if (mouseMoveTeardown.current) {
      mouseMoveTeardown.current();
    }
  }, []);

  // cleanup move event
  useEffect(
    () => () => {
      if (mouseMoveTeardown.current) {
        mouseMoveTeardown.current();
        mouseMoveTeardown.current = null;
      }
    },
    []
  );

  const onMouseMoveHandler = useCallback(({ clientX }) => {
    if (!resizeModeRef.current) return;

    const { clientX: oldClientX } = coordinate.current;

    let deltaX;
    if (rightToStretchRef.current) {
      deltaX = clientX - oldClientX;
    } else {
      deltaX = oldClientX - clientX;
    }

    const alignment = resolveAlignment();

    // 只有当时居中的时候，width的变化需要是滑动距离的两倍
    if (alignment === "center") {
      nextWidth.current = `${layout.current.width + deltaX * 2}px`;
    } else {
      nextWidth.current = `${layout.current.width + deltaX}px`;
    }
    nodeRef.current.style.width = nextWidth.current;
  }, []);

  useEffect(() => {
    leftBarRef.current.addEventListener("mousedown", onMouseDownLeftHandler);
    rightBarRef.current.addEventListener("mousedown", onMouseDownRightHandler);
    leftBarRef.current.addEventListener("mouseup", onMouseUpHandler);
    rightBarRef.current.addEventListener("mouseup", onMouseUpHandler);

    return () => {
      leftBarRef.current.removeEventListener(
        "mousedown",
        onMouseDownLeftHandler
      );
      rightBarRef.current.removeEventListener(
        "mousedown",
        onMouseDownRightHandler
      );
      leftBarRef.current.removeEventListener("mouseup", onMouseUpHandler);
      rightBarRef.current.removeEventListener("mouseup", onMouseUpHandler);
    };
  }, []);
};

export default useResize;
