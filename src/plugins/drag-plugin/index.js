import { EditorState } from "draft-js";
import DragDropManager from "./DragDropManager";
import transferBlock from "../../utils/block/transferBlock";
import BlockUtil from "../../utils/block/blockUtil";
import infoLog from "../../utils/infoLog";
const { insertNewLineAfterAll } = BlockUtil;

const DEBUG = true;

function DragPlugin() {
  this.apply = getEditor => {
    const { hooks } = getEditor();
    const manager = new DragDropManager({
      getEditor,
      onUpdate: ({ targetBlockKey, sourceBlockKey }) => {
        const { editorState } = getEditor();
        // selection should be related to the position you place the block
        const selection = editorState.getSelection();

        if (DEBUG) {
          infoLog(`place ${sourceBlockKey} after ${targetBlockKey}`);
          infoLog("block map ", editorState.getCurrentContent().getBlockMap());
        }

        const newContent = transferBlock(
          editorState,
          sourceBlockKey,
          targetBlockKey,
          "right"
        );

        if (DEBUG) {
          infoLog("block map after transform ", newContent.getBlockMap());
        }
        const nextNewContent = insertNewLineAfterAll(newContent);

        if (DEBUG) {
          infoLog(
            "block map after insert new line ",
            nextNewContent.getBlockMap()
          );
        }
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
      console.log("trigger tear down ---");
      manager.teardown();
    });
  };
}

export default DragPlugin;
