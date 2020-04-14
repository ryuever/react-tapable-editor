import { keyExtractor, blockKeyExtractor } from "./keyExtractor";
import { getNodeByOffsetKey } from "../../utils/findNode";
import { generateOffsetKey } from "../../utils/keyHelper";
import DropTarget from "./DropTarget";

class DragDropManager {
  constructor({ getEditor, onUpdate }) {
    this.dragSourceId = null;
    this.dropTargetIds = new Set();
    this.committedDropTargetIds = new Set();
    this.getEditor = getEditor;
    this.dropTargetListeners = [];
    this.globalPrepareListeners = [];
    this.sourcePrepareListeners = [];
    this.onUpdate = onUpdate;
  }

  prepare(sourceBlockKey) {
    this.prepareGlobalEventHandler();
    this.prepareCandidateSourceHandler(sourceBlockKey);
  }

  prevent = e => {
    e.preventDefault();
  };

  prepareGlobalEventHandler() {
    // window.document.addEventListener(
    //   "mousedown",
    //   this.globalDragStartHandlerCapture,
    //   // true
    // );
    // // window.document.addEventListener('mousemove', this.prevent)
    // // window.document.addEventListener("mouseup", this.globalDropHandler);
    // this.globalPrepareListeners.push(() => {
    //   window.document.removeEventListener(
    //     "mousedown",
    //     this.globalDragStartHandlerCapture
    //     // true
    //   );
    //   console.log("clear --");
    //   // window.document.removeEventListener('mousemove', this.prevent)
    //   // window.document.removeEventListener("mouseup", this.globalDropHandler);
    // });
  }

  prepareCandidateSourceHandler(blockKey) {
    const listenerId = keyExtractor(blockKey, "source");
    const offsetKey = generateOffsetKey(blockKey);

    const node = getNodeByOffsetKey(offsetKey);

    const dragStartHandler = e => this.dragStartHandler(e, listenerId);

    node.addEventListener("mousedown", dragStartHandler);
    window.document.addEventListener("mouseup", this.globalDropHandler);
    this.sourcePrepareListeners.push(() => {
      window.document.removeEventListener("mouseup", this.globalDropHandler);
      node.removeEventListener("mousedown", dragStartHandler);
    });
  }

  /**
   * first reset `dragSourceId`, and then setup `target` listener.
   */
  globalDragStartHandlerCapture = e => {
    console.log("mouse down");
    this.dragSourceId = null;

    // window.document.addEventListener('mousemove', this.prevent)
    // window.document.addEventListener("mouseup", this.globalDropHandler);

    this.globalPrepareListeners.push(() => {
      // window.document.removeEventListener(
      //   "mousedown",
      //   this.globalDragStartHandlerCapture
      //   // true
      // );
      // console.log("clear --");
      window.document.removeEventListener("mousemove", this.prevent);

      // window.document.removeEventListener("mouseup", this.globalDropHandler);
    });

    window.document.addEventListener("mouseup", this.globalDropHandler);
    // e.preventDefault();
  };

  globalDropHandler = e => {
    console.log("drop ");
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

  dragStartHandler = (e, sourceId) => {
    e.preventDefault();
    this.dragSourceId = sourceId;
    this.setupDropTarget();
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
    this.teardownGlobal();
    this.teardownSource();
    this.teardownTarget();
  }

  teardownGlobal() {
    this.globalPrepareListeners.forEach(listener => listener());
    this.globalPrepareListeners = [];
  }

  teardownSource() {
    this.sourcePrepareListeners.forEach(listener => listener());
    this.sourcePrepareListeners = [];
  }

  teardownTarget() {
    this.dropTargetListeners.forEach(targetListener =>
      targetListener.teardown()
    );
    this.dropTargetListeners = [];
  }
}

export default DragDropManager;
