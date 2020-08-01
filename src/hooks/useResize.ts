// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove
// https://media.prod.mdn.mozit.cloud/attachments/2013/03/05/5031/5692db994e59bae0b1c9e66f7df259b9/draggable_elements.html

import { useCallback, useRef, useEffect } from 'react';
import { EditorState } from 'draft-js';
import './styles/useResize.css';
import { HooksProps } from '../types';

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

const useResize = ({ nodeRef, props }: HooksProps) => {
  const { block, blockProps } = props;
  const { resizeLayout, getEditor } = blockProps;
  const nextWidth = useRef<string | undefined>();
  const coordinate = useRef<
    | {
        clientX: number;
        clientY: number;
      }
    | undefined
  >();
  const layout = useRef<
    | {
        width: number;
        height: number;
      }
    | undefined
  >();

  const leftBarRef = useRef<HTMLElement | undefined>();
  const rightBarRef = useRef<HTMLElement | undefined>();

  const mouseMoveTeardown = useRef<Function | null>(() => {});
  const resizeModeRef = useRef<boolean | undefined>();
  const rightToStretchRef = useRef<boolean | undefined>();

  // fix: `mouseenter` and `mouseleave` will be triggered on moving under resize mode...
  const statusRef = useRef<string | null>(null);

  useEffect(() => {
    // create a bar and append to nodeRef
    const leftNode = document.createElement('div');
    leftNode.classList.add('left-bar-wrapper');
    const leftBar = document.createElement('div');
    leftBar.classList.add('bar');
    leftNode.appendChild(leftBar);
    leftBarRef.current = leftNode;

    const rightNode = document.createElement('div');
    rightNode.classList.add('right-bar-wrapper');
    const rightBar = document.createElement('div');
    rightBar.classList.add('bar');
    rightNode.appendChild(rightBar);
    rightBarRef.current = rightNode;

    nodeRef.current!.appendChild(leftBarRef.current);
    nodeRef.current!.appendChild(rightBarRef.current);
    nodeRef.current!.classList.add('resizable-component');
  }, [nodeRef]);

  // make resize bar visible when enter into container...
  const onMouseEnterContainer = useCallback(() => {
    if (statusRef.current === 'moving') return;
    leftBarRef.current!.classList.add('bar-visible');
    rightBarRef.current!.classList.add('bar-visible');
  }, []);
  const onMouseLeaveContainer = useCallback(() => {
    if (statusRef.current === 'moving') return;
    leftBarRef.current!.classList.remove('bar-visible');
    rightBarRef.current!.classList.remove('bar-visible');
  }, []);

  const nodeRefCopy = nodeRef.current;

  useEffect(() => {
    if (nodeRefCopy) {
      nodeRefCopy.addEventListener('mouseenter', onMouseEnterContainer);
      nodeRefCopy.addEventListener('mouseleave', onMouseLeaveContainer);

      return () => {
        nodeRefCopy!.removeEventListener('mouseenter', onMouseEnterContainer);
        nodeRefCopy!.removeEventListener('mouseleave', onMouseLeaveContainer);
      };
    }
    return () => {};
  }, [nodeRefCopy, onMouseEnterContainer, onMouseLeaveContainer]);

  const resolveAlignment = useCallback(() => {
    return 'center';
  }, []);

  const onMouseMoveHandler = useCallback(
    ({ clientX }) => {
      if (!resizeModeRef.current) return;
      statusRef.current = 'moving';

      const { clientX: oldClientX } = coordinate.current || {};

      let deltaX;
      if (rightToStretchRef.current) {
        deltaX = clientX - oldClientX!;
      } else {
        deltaX = oldClientX! - clientX;
      }

      const alignment = resolveAlignment();

      if (layout.current) {
        // 只有当时居中的时候，width的变化需要是滑动距离的两倍
        if (alignment === 'center') {
          nextWidth.current = `${layout.current.width + deltaX * 2}px`;
        } else {
          nextWidth.current = `${layout.current.width + deltaX}px`;
        }
      }

      if (nextWidth.current) nodeRef.current!.style.width = nextWidth.current;
    },
    [nodeRef, resolveAlignment]
  );

  const prepareAfterMouseDown = useCallback(
    event => {
      resizeModeRef.current = true;
      const { clientX, clientY } = event;
      const { offsetWidth, offsetHeight } = nodeRef.current as HTMLElement;

      coordinate.current = { clientX, clientY };
      layout.current = {
        width: offsetWidth,
        height: offsetHeight,
      };

      // when narrowing image, mouse may be on the outer of image...
      // So we'd better add event listener on document...
      document.addEventListener('mousemove', onMouseMoveHandler);
      if (mouseMoveTeardown.current) mouseMoveTeardown.current();
      mouseMoveTeardown.current = () => {
        document.removeEventListener('mousemove', onMouseMoveHandler);
        mouseMoveTeardown.current = null;
      };
    },
    [nodeRef, onMouseMoveHandler]
  );

  const onMouseDownLeftHandler = useCallback(
    event => {
      prepareAfterMouseDown(event);
      rightToStretchRef.current = false;
    },
    [prepareAfterMouseDown]
  );

  const onMouseDownRightHandler = useCallback(
    event => {
      prepareAfterMouseDown(event);
      rightToStretchRef.current = true;
    },
    [prepareAfterMouseDown]
  );

  const onMouseUpHandler = useCallback(() => {
    resizeModeRef.current = false;
    statusRef.current = null;

    if (mouseMoveTeardown.current) mouseMoveTeardown.current();

    if (nextWidth.current) {
      const { editorState, hooks } = getEditor();
      const contentState = editorState.getCurrentContent();
      const entityKey = block.getEntityAt(0);
      const newContent = contentState.mergeEntityData(entityKey, {
        resizeLayout: {
          width: nextWidth.current,
        },
      });
      const nextState = EditorState.push(
        editorState,
        newContent,
        'change-block-data'
      );
      hooks.setState.call(nextState);
    }
  }, [block, getEditor]);

  useEffect(() => {
    if (nodeRef.current)
      (nodeRef.current as HTMLDivElement).style.width = resizeLayout.width;
  }, [nodeRef, resizeLayout.width]);

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

  useEffect(() => {
    leftBarRef.current!.addEventListener('mousedown', onMouseDownLeftHandler);
    rightBarRef.current!.addEventListener('mousedown', onMouseDownRightHandler);

    // leftBarRef.current.addEventListener("mouseup", onMouseUpHandler);
    // rightBarRef.current.addEventListener("mouseup", onMouseUpHandler);

    // should use document. leftBarRef.current `mouseup` may be not trigger, if
    // you resize the container, but mouse is on the outer.
    document.addEventListener('mouseup', onMouseUpHandler);
    document.addEventListener('mouseup', onMouseUpHandler);

    return () => {
      leftBarRef.current!.removeEventListener(
        'mousedown',
        onMouseDownLeftHandler
      );
      rightBarRef.current!.removeEventListener(
        'mousedown',
        onMouseDownRightHandler
      );
      document.removeEventListener('mouseup', onMouseUpHandler);
      document.removeEventListener('mouseup', onMouseUpHandler);
    };
  }, [onMouseDownLeftHandler, onMouseDownRightHandler, onMouseUpHandler]);
};

export default useResize;
