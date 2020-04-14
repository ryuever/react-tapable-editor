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

import throttle from "../../utils/throttle";
import getBoundingRectWithSafeArea from "../../utils/rect/getBoundingRectWithSafeArea";
import findBlockContainsPoint from "../../utils/rect/findBlockContainsPoint";
import {
  getNodeByOffsetKey,
  getSelectableNodeByOffsetKey
} from "../../utils/findNode";
import { extractBlockKeyFromOffsetKey } from "../../utils/keyHelper";
import "./styles.css";
import createAddOn from "./createAddOn";
import { bindEventsOnce, bindEvents } from "../../utils/event/bindEvents";

function SidebarPlugin() {
  let current = null;

  this.apply = getEditor => {
    const removeNode = () => {
      try {
        if (!current) return;
        const { node, child, teardown } = current;
        if (typeof teardown === "function") teardown();
        if (node.contains(child)) node.removeChild(child);
        current = null;
      } catch (err) {
        console.log("[SideBarPlugin]: removeNode error ", err);
      }
    };

    let isDragging = false;

    const mouseMoveHandler = e => {
      try {
        const { editorState } = getEditor();
        const coordinateMap = getBoundingRectWithSafeArea(editorState);
        const { shiftLeft, shiftRight } = coordinateMap;

        if (!shiftLeft) return;

        const x = e.pageX;
        const y = e.pageY;

        const nodeInfo = findBlockContainsPoint(shiftLeft, { x, y });
        if (!nodeInfo) return;
        const { offsetKey } = nodeInfo;
        const node = getNodeByOffsetKey(offsetKey);
        if (current && current.node === node) return;
        if (current && current.node !== node) removeNode();

        const child = createAddOn(offsetKey);
        console.log("add ", node, current && current.node);
        node.appendChild(child);

        const selectableNode = getSelectableNodeByOffsetKey(offsetKey);
        const enterHandler = e => {
          e.preventDefault();
          const node = getNodeByOffsetKey(offsetKey);

          const { hooks } = getEditor();
          const blockKey = extractBlockKeyFromOffsetKey(offsetKey);
          hooks.prepareDragStart.call(blockKey);

          bindEventsOnce(document, {
            eventName: "mousedown",
            fn: () => {
              if (!isDragging) isDragging = true;
              bindEventsOnce(document, {
                eventName: "mouseup",
                fn: () => {
                  hooks.teardownDragDrop.call();
                }
              });
            }
          });
        };
        const leaveHandler = e => {
          e.preventDefault();
          const { hooks } = getEditor();

          // which means `mousedown` is triggered...
          if (isDragging) return;
          hooks.teardownDragDrop.call();
        };

        const teardown = bindEventsOnce(selectableNode, {
          eventName: "mouseenter",
          fn: e => {
            enterHandler(e);
            bindEventsOnce(selectableNode, {
              eventName: "mouseleave",
              fn: leaveHandler
            });
          }
        });

        // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
        requestAnimationFrame(() =>
          child.classList.add("sidebar-addon-visible")
        );
        current = { node, child, offsetKey, teardown };
      } catch (err) {
        console.log("err in SideBar plugin ", err);
      }
    };

    // when user start input, sidebar should disappear...
    // Note: `removeChild` will cause `block` delete issue in a situation described below.
    //   1. hover cursor on a block
    //   2. type in chinese character on other block
    //   3. the block content under cursor will be cleared...
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
        eventName: "mousemove",
        fn: throttledMoveHandler
      },
      {
        eventName: "keydown",
        fn: throttledKeydownHandler
      }
    ]);
  };
}

export default SidebarPlugin;
