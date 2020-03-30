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

    // this.dragEnterHandler = throttle(this.dragEnterHandler, 100)
    // this.dragLeaveHandler = throttle(this.dragLeaveHandler, 100)
    // this.dragOverHandler = throttle(this.dragOverHandler, 50)
    // this.dropHandler = throttle(this.dropHandler, 100)

    this.setup();
  }

  dragEnterHandler = e => {
    e.preventDefault();
    this.addDropTarget(this.listenerKey);
    console.log("enter ", this.listenerKey);
  };

  dragLeaveHandler = e => {
    e.preventDefault();
    this.removeDropTarget(this.listenerKey);
  };

  /**
   * https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome
   * Could not throttle `dragOverHandler` directly. or `dropHandler` will be not triggered.
   */
  dragOverHandler = e => {
    e.preventDefault();
    console.log("over ", this.listenerKey);
  };

  dropHandler = e => {
    console.log("drop ", this.listenerKey);
  };

  setup() {
    const node = getNodeByOffsetKey(this.offsetKey);
    node.addEventListener("dragenter", this.dragEnterHandler);
    node.addEventListener("dragleave", this.dragLeaveHandler);
    node.addEventListener("dragover", this.dragOverHandler);
    node.addEventListener("drop", this.dropHandler);

    return () => {
      this.teardown();
    };
  }

  teardown() {
    const node = getNodeByOffsetKey(this.offsetKey);
    node.removeEventListener("dragenter", this.dragEnterHandler);
    node.removeEventListener("dragleave", this.dragLeaveHandler);
    node.removeEventListener("dragover", this.dragOverHandler);
    node.removeEventListener("drop", this.dropHandler);
  }
}

export default DropTarget;
