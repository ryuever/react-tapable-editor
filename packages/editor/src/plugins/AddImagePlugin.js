
function AddImagePlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor();

    hooks.createPlaceholder.tap('AddImagePlugin', (editorState, placeholder) => {
      const entityType = 'IMAGE';
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        entityType,
        'IMMUTABLE',
        { text: placeholder },
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' ',
      );
      hooks.onChange.call(newEditorState);
    });

    hooks.blockRendererFn.tap('PlaceholderPlugin', (contentBlock, editorState) => {
      if (contentBlock.getType() === 'atomic') {
        const contentState = editorState.getCurrentContent();
        const entity = contentBlock.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        if (type === 'IMAGE') {
          return {
            component: () => <div style={{ position: 'absolute' }}>hello</div>,
            editable: false,
          };
        }
      }
    });
  };
}
