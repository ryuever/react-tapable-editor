import { AtomicBlockUtils, EditorState } from 'draft-js';
import Image from '../components/image';
import { GetEditor } from '../types';

const DecoratedImage = Image;
function AddImagePlugin() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();

    hooks.addImage.tap(
      'AddImagePlugin',
      (
        editorState: EditorState,
        file: {
          src: string;
        }
      ) => {
        const { src } = file || {};
        if (!src) return;
        const entityType = 'IMAGE';
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          entityType,
          'IMMUTABLE',
          {
            src,
            alignment: 'center',
            resizeLayout: {
              width: '900px',
            },
          }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
          editorState,
          entityKey,
          ' '
        );

        hooks.setState.call(newEditorState);
      }
    );

    // 函数触发的时机，是否可以将alignment属性设置到props
    hooks.blockRendererFn.tap('AddImagePlugin', (contentBlock, editorState) => {
      if (contentBlock && contentBlock.getType() === 'atomic') {
        const contentState = editorState.getCurrentContent();
        const entity = contentBlock.getEntityAt(0);
        if (!entity) return null;
        const entityState = contentState.getEntity(entity);
        const type = entityState.getType();
        const data = entityState.getData();
        if (type === 'IMAGE') {
          const { alignment, resizeLayout } = data;

          return {
            component: DecoratedImage,
            editable: false,
            props: {
              getEditor,
              alignment,
              resizeLayout,
            },
          };
        }
      }
      return null;
    });
  };
}

export default AddImagePlugin;
