import { AtomicBlockUtils } from "draft-js";

// import focus from "../decorators/focus";
import alignment from "../decorators/alignment";
import Image from "../components/image";
// import resizable from "../decorators/resizable";

const DecoratedImage = alignment(Image);
// const DecoratedImage = resizable(alignment(focus(Image)));

function AddImagePlugin() {
  this.apply = getEditor => {
    const { hooks } = getEditor();

    hooks.addImage.tap("AddImagePlugin", (editorState, file) => {
      const { src } = file || {};
      if (!src) return;
      const entityType = "IMAGE";
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        entityType,
        "IMMUTABLE",
        {
          src,
          alignment: "center",
          resizeLayout: {
            width: "900px"
          }
        }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        " "
      );

      hooks.setState.call(newEditorState);
    });

    // 函数触发的时机，是否可以将alignment属性设置到props
    hooks.blockRendererFn.tap("AddImagePlugin", (contentBlock, editorState) => {
      if (contentBlock.getType() === "atomic") {
        const contentState = editorState.getCurrentContent();
        const entity = contentBlock.getEntityAt(0);
        if (!entity) return null;
        const entityState = contentState.getEntity(entity);
        const type = entityState.getType();
        const data = entityState.getData();
        if (type === "IMAGE") {
          const { alignment, resizeLayout } = data;

          return {
            component: DecoratedImage,
            editable: false,
            props: {
              getEditor,
              alignment,
              resizeLayout
            }
          };
        }
      }
    });
  };
}

export default AddImagePlugin;
