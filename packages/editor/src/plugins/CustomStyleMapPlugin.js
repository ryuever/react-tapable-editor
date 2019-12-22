export default () => {
  this.apply = getEditor => {
    const { hooks } = getEditor()
    hooks.createCustomStyleMap.tap(
      'CustomStyleMapPlugin',
      (customStyleMap = {}) => {
        return {
          CODE: {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
            fontSize: 16,
            padding: 2,
          },
          ...customStyleMap,
        }
      }
    )
  }
}