function CustomStyleMapPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor();
    hooks.createCustomStyleMap.tap(
      'CustomStyleMapPlugin',
      (customStyleMap = {}) => ({
        CODE: {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
          fontSize: 16,
          padding: 2,
        },
        ...customStyleMap,
      }),
    );
  };
}

export default CustomStyleMapPlugin;
