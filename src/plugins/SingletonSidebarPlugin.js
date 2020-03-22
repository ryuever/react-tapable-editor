import { EditorState } from "draft-js";
import throttle from "../utils/throttle";
import getBoundingRectWithSafeArea from "../utils/rect/getBoundingRectWithSafeArea";
import findBlockContainsPoint from "../utils/rect/findBlockContainsPoint";
import createAddOn from "./sidebar-plugin/createAddOn";
import { getNodeByOffsetKey } from "../utils/findNode";
import { getSelectableNodeByListenerKey } from "./sidebar-plugin/utils";
import "./sidebar-plugin/styles.css";

/**
 * The reason why sidebar should be created every times...
 * 1. An attempt to create a top level Sidebar component, but when fulfill drag functionality,
 *    It has big trouble...How could i set `draggable` attribute and drag the related block.
 */

function SingletonSidebarPlugin() {
  let current = null;

  this.apply = getEditor => {
    const { hooks, editorRef, sidebarRef } = getEditor();

    const removeNode = () => {
      try {
        if (!current) return;
        const { node, child } = current;
        // check has child first.
        if (node.contains(child)) node.removeChild(child);
        current = null;
      } catch (err) {
        console.log("err ", err);
      }
    };

    const mouseMoveHandler = e => {
      const { editorState } = getEditor();
      const coordinateMap = getBoundingRectWithSafeArea(editorState);
      const x = e.pageX;
      const y = e.pageY;

      const nodeInfo = findBlockContainsPoint(coordinateMap, { x, y });

      if (nodeInfo) {
        const { key } = nodeInfo;
        const node = getNodeByOffsetKey(key);
        if (current) {
          if (current.node === node) return;
          else removeNode();
        }
        const child = createAddOn(key);
        node.appendChild(child);
        const selectableNode = getSelectableNodeByListenerKey(key);
        // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
        requestAnimationFrame(() => {
          child.classList.add("sidebar-addon-visible");
        });
        current = { node, child, key };
      }
    };
    const keyDownHandler = e => {
      removeNode();
    };

    const throttledMoveHandler = throttle(mouseMoveHandler, 50);
    const throttledKeyDownHandler = throttle(keyDownHandler, 50);
    document.addEventListener("mousemove", throttledMoveHandler);
    document.addEventListener("keydown", throttledKeyDownHandler);
  };
}

export default SingletonSidebarPlugin;
