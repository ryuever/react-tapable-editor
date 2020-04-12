import { keyExtractor } from "./keyExtractor";
import { generateOffsetKey } from "../../utils/keyHelper";
import { getNodeByOffsetKey } from "../../utils/findNode";
import throttle from "../../utils/throttle";

class DropTarget {
  constructor({ blockKey, addDropTarget, removeDropTarget }) {
    this.blockKey = blockKey;
    this.offsetKey = generateOffsetKey(this.blockKey);
    this.listenerKey = keyExtractor(blockKey, "target");
    this.addDropTarget = addDropTarget;
    this.removeDropTarget = removeDropTarget;
    this.setup();
  }

  dragEnterHandler = e => {
    e.preventDefault();
    console.log("x");
    this.addDropTarget(this.listenerKey);
  };

  dragLeaveHandler = e => {
    e.preventDefault();
    console.log("mouse leave ");
    this.removeDropTarget(this.listenerKey);
  };

  /**
   * https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome
   * Could not throttle `dragOverHandler` directly. or `dropHandler` will be not
   * triggered.
   */
  dragOverHandler = e => {
    e.preventDefault();
  };

  setup() {
    const node = getNodeByOffsetKey(this.offsetKey);
    // node.addEventListener("dragenter", this.dragEnterHandler);
    // node.addEventListener("dragleave", this.dragLeaveHandler);
    // node.addEventListener("dragover", this.dragOverHandler);
    node.addEventListener("mouseenter", this.dragEnterHandler, true);
    node.addEventListener("mouseleave", this.dragLeaveHandler, true);
    // node.addEventListener("mouseover", this.dragOverHandler, true);

    return () => {
      this.teardown();
    };
  }

  teardown() {
    const node = getNodeByOffsetKey(this.offsetKey);
    // node.removeEventListener("dragenter", this.dragEnterHandler);
    // node.removeEventListener("dragleave", this.dragLeaveHandler);
    // node.removeEventListener("dragover", this.dragOverHandler);
    node.removeEventListener("mouseenter", this.dragEnterHandler, true);
    node.removeEventListener("mouseleave", this.dragLeaveHandler, true);
    // node.removeEventListener("mouseover", this.dragOverHandler);
  }
}

export default DropTarget;
