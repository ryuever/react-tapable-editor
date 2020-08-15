/**
 * 1. mouse enter into block (including safe area and block itself), side bar should display on
 *    current block. when mouse position do not belong to any block, side bar will be put by the
 *    side of block where selection exist.
 * 2. If side bar display, only if you begin to typing characters it will disappear.
 *    1. select text in same block will not trigger its disappear
 *    2. select text range including other block, it will make sidebar appear on other block's heading.
 *    3. click a position will not trigger its disappear
 * 3. when typing or enter into new line, sidebar should not display...
 * 4. when hover on a image, how to handle imageBar and sidebar
 *
 * The reason why sidebar should be created every times...
 * 1. An attempt to create a top level Sidebar component, but when fulfill drag functionality,
 *    It has big trouble...How could i set `draggable` attribute and drag the related block, it means
 *    sidebar trigger setting block as `draggable` and trigger related block to move. So it'd better make
 *    sidebar belong to block.
 */

import throttle from '../../utils/throttle';
import getBoundingRectWithSafeArea from '../../utils/rect/getBoundingRectWithSafeArea';
import findBlockContainsPoint from '../../utils/rect/findBlockContainsPoint';
import {
  getNodeByOffsetKey,
  getSelectableNodeByOffsetKey,
} from '../../utils/findNode';
import { extractBlockKeyFromOffsetKey } from '../../utils/keyHelper';
import './styles.css';
import createAddOn from './createAddOn';
import { bindEventsOnce, bindEvents } from '../../utils/event/bindEvents';
import { GetEditor, CurrentSidebar } from '../../types';

function SidebarPlugin() {
  let current: CurrentSidebar | null = null;

  this.apply = (getEditor: GetEditor) => {
    const removeNode = () => {
      try {
        if (!current) return;
        const { node, child, teardown } = current;
        if (typeof teardown === 'function') teardown();
        if (node.contains(child)) node.removeChild(child);
        current = null;
      } catch (err) {
        console.log('[SideBarPlugin]: removeNode error ', err);
      }
    };

    let isDragging = false;

    const mouseMoveHandler = (e: MouseEvent) => {
      try {
        const { editorState } = getEditor();
        const coordinateMap = getBoundingRectWithSafeArea(editorState);
        const { shiftLeft } = coordinateMap || {};

        if (!shiftLeft) return;

        // get mouse event point related to viewport
        // https://stackoverflow.com/questions/14717617/how-to-get-the-mouse-position-relative-to-the-window-viewport-in-javascript
        const x = e.clientX;
        const y = e.clientY;

        const nodeInfo = findBlockContainsPoint(shiftLeft, { x, y });

        if (!nodeInfo) return;
        const { offsetKey } = nodeInfo;
        const node = getNodeByOffsetKey(offsetKey) as HTMLElement;
        if (current && current.node === node) return;

        // Compare the current node with existing node. if it is not the same, it means
        // cursor moves to other block. So we should removeNode...
        if (current && current.node !== node) removeNode();

        const child = createAddOn(offsetKey);
        if (node) node.appendChild(child);

        const selectableNode = getSelectableNodeByOffsetKey(
          offsetKey
        ) as HTMLElement;
        const enterHandler = () => {
          const node = getNodeByOffsetKey(offsetKey) as HTMLElement;
          const { hooks } = getEditor();
          const blockKey = extractBlockKeyFromOffsetKey(offsetKey);
          hooks.prepareDragStart.call(blockKey);

          bindEventsOnce(node, {
            eventName: 'mousedown',
            fn: () => {
              // To make teardown or not...
              if (!isDragging) isDragging = true;
              bindEventsOnce(node, {
                eventName: 'mouseup',
                fn: () => {
                  hooks.teardownDragDrop.call();
                },
              });
            },
          });
        };
        const leaveHandler = (e: MouseEvent) => {
          e.preventDefault();
          const { hooks } = getEditor();

          // which means `mousedown` is triggered...
          if (isDragging) return;
          hooks.teardownDragDrop.call();
        };

        const teardown = bindEventsOnce(selectableNode, {
          eventName: 'mouseenter',
          fn: () => {
            enterHandler();
            bindEventsOnce(selectableNode, {
              eventName: 'mouseleave',
              fn: leaveHandler,
            });
          },
        });

        // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
        requestAnimationFrame(() =>
          child.classList.add('sidebar-addon-visible')
        );
        current = { node, child, offsetKey, teardown };
      } catch (err) {
        console.log('err in SideBar plugin ', err);
      }
    };

    // when user start typing, sidebar should disappear...
    // Note: `removeChild` will cause `block` delete issue in a situation described below.
    //   1. hover cursor on a block
    //   2. type in chinese character on other block
    //   3. the block content under cursor will be cleared...
    // TODO: In composition mode. blocks will be re-rendered, which may cause removed DOM's
    //       event handler is not cleared...
    const keydownHandler = () => {
      const { editorState } = getEditor();
      if (editorState.isInCompositionMode()) return;
      removeNode();
    };
    const throttledMoveHandler = throttle(mouseMoveHandler, 50);
    const throttledKeydownHandler = throttle(keydownHandler, 50);

    // global document mousemove to determine which dom cursor is in...
    // It has a drawback, rect should be calculated on every move...
    bindEvents(document, [
      {
        eventName: 'mousemove',
        fn: throttledMoveHandler,
      },
      {
        eventName: 'keydown',
        fn: throttledKeydownHandler,
      },
    ]);
  };
}

export default SidebarPlugin;
