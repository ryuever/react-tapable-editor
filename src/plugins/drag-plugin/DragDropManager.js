import { keyExtractor, blockKeyExtractor } from "./keyExtractor";
import DropTarget from "./DropTarget";
import { getNodeByOffsetKey } from "../../utils/findNode";
import { generateOffsetKey } from "../../utils/keyHelper";
import { bindEventsOnce } from "../../utils/event/bindEvents";

class DragDropManager {
  constructor({ getEditor, onUpdate }) {
    this.dragSourceId = null;
    this.dropTargetIds = new Set();
    this.committedDropTargetIds = new Set();
    this.getEditor = getEditor;
    this.dropTargetListeners = [];
    this.dragSourceListeners = [];
    this.onUpdate = onUpdate;
  }

  prepare(sourceBlockKey) {
    this.prepareCandidateSourceHandler(sourceBlockKey);
  }

  mousedownHandler = (e, sourceId) => {
    // `e.preventDefault()` is required to prevent selection on move..
    e.preventDefault();

    this.dragSourceId = sourceId;
    this.setupDropTarget();
  };

  prepareCandidateSourceHandler(blockKey) {
    const listenerId = keyExtractor(blockKey, "source");
    const offsetKey = generateOffsetKey(blockKey);
    const node = getNodeByOffsetKey(offsetKey);
    const teardown = bindEventsOnce(node, {
      eventName: "mousedown",
      fn: e => {
        this.mousedownHandler(e, listenerId);

        bindEventsOnce(window, {
          eventName: "mouseup",
          fn: this.globalMouseupHandler
        });
      }
    });
    this.dragSourceListeners.push(teardown);
  }

  globalMouseupHandler = e => {
    this.teardown();
    const targetIds = [...this.committedDropTargetIds];
    const targetId = targetIds.pop();

    const targetBlockKey = blockKeyExtractor(targetId);
    const sourceBlockKey = blockKeyExtractor(this.dragSourceId);

    this.onUpdate({
      targetBlockKey,
      sourceBlockKey
    });

    this.committedDropTargetIds = new Set();
    this.dropTargetIds = new Set();
    this.dragSourceId = null;
  };

  addDropTarget = dropTargetId => {
    this.dropTargetIds.add(dropTargetId);
    this.committedDropTargetIds.add(dropTargetId);
  };

  removeDropTarget = dropTargetId => {
    this.dropTargetIds.delete(dropTargetId);
  };

  /**
   * setup what block should sensitive to mouseup event...
   *
   * Blocks should setup
   *   1. null parent and zero length children block
   *   2. has parent but zero length children block
   *
   * Block should not setup
   *   1. has parent and children
   */
  setupDropTarget() {
    const { editorState } = this.getEditor();
    const currentContent = editorState.getCurrentContent();
    const blockMap = currentContent.getBlockMap();

    const sourceBlockKey = blockKeyExtractor(this.dragSourceId);

    blockMap.toSeq().forEach((block, blockKey) => {
      // `dragSource` could not be `dropTarget`
      if (sourceBlockKey === blockKey) return;

      const { children } = block;
      const childrenSize = children.size;

      if (!childrenSize) {
        this.setupBlock(blockKey);
      }
    });
  }

  setupBlock(blockKey) {
    const targetListener = new DropTarget({
      blockKey,
      addDropTarget: this.addDropTarget,
      removeDropTarget: this.removeDropTarget
    });
    this.dropTargetListeners.push(targetListener);
  }

  teardown() {
    this.teardownSource();
    this.teardownTarget();
  }

  teardownSource() {
    this.dragSourceListeners.forEach(listener => listener());
    this.dragSourceListeners = [];
  }

  teardownTarget() {
    this.dropTargetListeners.forEach(targetListener =>
      targetListener.teardown()
    );
    this.dropTargetListeners = [];
  }
}

export default DragDropManager;
