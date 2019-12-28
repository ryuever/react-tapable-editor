function BlockStyleFnPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor();
    hooks.blockStyleFn.tap('BlockStyleFnPlugin', (block) => {
      switch (block.getType()) {
        // 控制比如说，最后渲染出来的引用，它的class是
        case 'blockquote':
          return 'miuffy-blockquote';
        case 'unstyled':
          return 'miuffy-paragraph';
        case 'unordered-list-item':
          return 'miuffy-unordered-list-item';
        default: return null;
      }
    });
  };
}

export default BlockStyleFnPlugin;
