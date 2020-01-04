import { AtomicBlockUtils } from 'draft-js'
import Focus from '../decorators/Focus'
import Image from '../components/image'
import isBlockFocused from '../utils/isBlockFocused'

// const DecoratedImage = Image
const DecoratedImage = Focus(Image)

function AddImagePlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor();

    hooks.addImage.tap('AddImagePlugin', (editorState, file) => {
      const { src } = file || {}
      if (!src) return
      const entityType = 'IMAGE';
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        entityType,
        'IMMUTABLE',
        { src },
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' ',
      );

      hooks.setState.call(newEditorState)
    });

    hooks.blockRendererFn.tap('AddImagePlugin', (contentBlock, editorState) => {
      if (contentBlock.getType() === 'atomic') {
        const contentState = editorState.getCurrentContent();
        const entity = contentBlock.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        if (type === 'IMAGE') {
          return {
            component: DecoratedImage,
            editable: false,
            props: {
              getEditor,
            }
          };
        }
      }
    });
  };
}

export default AddImagePlugin