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

function SidebarPlugin() {
  let current = null;

  this.apply = getEditor => {
    const removeNode = () => {
      try {
        if (!current) return;
        const { node, child, eventCleaner } = current;
        if (typeof eventCleaner === "function") eventCleaner;
        if (node.contains(child)) node.removeChild(child);
        current = null;
      } catch (err) {
        console.log("err ", err);
      }
    };

    const mouseMoveHandler = e => {
      // e.preventDefault()
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
      node.appendChild(child);

      const selectableNode = getSelectableNodeByOffsetKey(offsetKey);
      const enterHandler = e => {
        e.preventDefault();
        const node = getNodeByOffsetKey(offsetKey);
        node.setAttribute("draggable", true);

        const { hooks } = getEditor();
        const blockKey = extractBlockKeyFromOffsetKey(offsetKey);
        hooks.prepareDragStart.call(blockKey);
      };
      const leaveHandler = e => {
        e.preventDefault();
        const node = getNodeByOffsetKey(offsetKey);
        node.removeAttribute("draggable");
        const { hooks } = getEditor();
        hooks.teardownDragDrop.call();
      };
      selectableNode.addEventListener("mouseenter", enterHandler);
      selectableNode.addEventListener("mouseleave", leaveHandler);
      const eventCleaner = () => {
        selectableNode.removeEventListener("mouseenter", enterHandler);
        selectableNode.removeEventListener("mouseleave", leaveHandler);
      };

      // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
      requestAnimationFrame(() => child.classList.add("sidebar-addon-visible"));
      current = { node, child, offsetKey, eventCleaner };
    };

    const keyDownHandler = e => removeNode();

    const throttledMoveHandler = throttle(mouseMoveHandler, 50);
    const throttledKeyDownHandler = throttle(keyDownHandler, 50);
    document.addEventListener("mousemove", throttledMoveHandler);
    document.addEventListener("keydown", throttledKeyDownHandler);
  };
}

export default SidebarPlugin;
