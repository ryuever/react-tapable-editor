import { EditorState } from "draft-js";
import DragDropManager from "./DragDropManager";
import transferBlock from "../../utils/block/transferBlock";
import BlockUtil from "../../utils/block/blockUtil";
const { insertNewLineAfterAll } = BlockUtil;

function DragPlugin() {
  this.apply = getEditor => {
    const { hooks } = getEditor();
    const manager = new DragDropManager({
      getEditor,
      onUpdate: ({ targetBlockKey, sourceBlockKey }) => {
        const { editorState } = getEditor();
        // selection should be related to the position you place the block
        const selection = editorState.getSelection();
        const newContent = transferBlock(
          editorState,
          sourceBlockKey,
          targetBlockKey,
          "right"
        );
        const nextNewContent = insertNewLineAfterAll(newContent);
        const dismissSelection = EditorState.push(
          editorState,
          nextNewContent.merge({
            selectionBefore: selection,
            selectionAfter: nextNewContent
              .getSelectionAfter()
              .set("hasFocus", false)
          })
        );

        hooks.setState.call(dismissSelection);
      }
    });

    hooks.prepareDragStart.tap("DragPlugin", sourceBlockKey => {
      manager.prepare(sourceBlockKey);
    });

    hooks.teardownDragDrop.tap("DragPlugin", () => {
      manager.teardown();
    });
  };
}

export default DragPlugin;
