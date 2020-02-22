import keyExtractor from "./keyExtractor";
import createAddOn from "./createAddOn";
import store from "./store";

import "./styles.css";

class DragSource {
  constructor(blockKey, node) {
    this.node = node;
    this.blockKey = blockKey;
    this.sourceId = keyExtractor(this.blockKey, "source");

    this.setup();
  }

  setup() {
    // 先检查一下node是否有`draggable`属性
    const draggableAttribute = this.node.getAttribute("draggable");
    if (!draggableAttribute) {
      // this.node.setAttribute('draggable', true)
      this.node.appendChild(createAddOn());
    }

    this.node.addEventListener("dragstart", this.handleDragStart);

    return () => {
      // this.sourceNodes.delete(sourceId)
      // this.sourceNodeOptions.delete(sourceId)
      // node.removeEventListener('dragstart', handleDragStart)
      // node.removeEventListener('selectstart', handleSelectStart)
      // node.setAttribute('draggable', 'false')
    };
  }

  handleDragStart = () => {
    store.setDragSourceIds([this.sourceId]);
  };

  teardown() {}
}

export default DragSource;
