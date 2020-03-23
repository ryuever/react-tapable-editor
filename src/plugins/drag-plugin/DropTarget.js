import { keyExtractor } from "./keyExtractor";
import { generateOffsetKey } from "../../utils/keyHelper";
import { getNodeByOffsetKey } from "../../utils/findNode";

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
    this.addDropTarget(this.listenerKey);
    console.log("enter ", this.listenerKey);
  };

  dragLeaveHandler = e => {
    e.preventDefault();
    this.removeDropTarget(this.listenerKey);
  };

  dragOverHandler = e => {
    e.preventDefault();
    console.log("over ", this.listenerKey);
  };

  // https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome
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
