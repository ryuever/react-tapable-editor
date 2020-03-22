import { EditorState } from "draft-js";
import throttle from "../utils/throttle";
import getBoundingRectWithSafeArea from "../utils/rect/getBoundingRectWithSafeArea";

function SingletonSidebarPlugin() {
  this.apply = getEditor => {
    const { hooks, editorRef, sidebarRef } = getEditor();

    const mouseMoveHandler = e => {
      const { editorState } = getEditor();
      getBoundingRectWithSafeArea(editorState);
    };

    const moveHandler = throttle(mouseMoveHandler, 150);

    document.addEventListener("mousemove", moveHandler);
  };
}

export default SingletonSidebarPlugin;
