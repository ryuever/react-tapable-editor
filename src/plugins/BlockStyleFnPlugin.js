import './blockStyleFnPlugin.css'

function BlockStyleFnPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor();
    hooks.blockStyleFn.tap('BlockStyleFnPlugin', (...props) => {
      // console.log('block style : ')
      const block = props[0]
      switch (block.getType()) {
        // 控制比如说，最后渲染出来的引用，它的class是
        case 'blockquote':
          return 'miuffy-blockquote';
        case 'unstyled':
          return 'miuffy-paragraph';
        case 'unordered-list-item':
          return 'miuffy-unordered-list-item';
        case 'atomic':
          const { editorState } = getEditor()
          const contentState = editorState.getCurrentContent();
          const entity = block.getEntityAt(0);
          if (!entity) return null;
          const entityState = contentState.getEntity(entity)
          const type = entityState.getType();
          const data = entityState.getData()
          if (type === 'IMAGE') {
            const { alignment } = data
            console.log('alignment : ', alignment)

            switch(alignment) {
              case 'center':
                return 'figure-image-center'
              case 'right':
                return 'figure-image-right'
              case 'left':
                return 'figure-image-left'
              case 'leftFill':
                return 'figure-image-left-fill'
              case 'rightFill':
                return 'figure-image-right-fill'
            }
            return 'figure-image'
          }
        default: return null;
      }
    });
  };
}

export default BlockStyleFnPlugin;
