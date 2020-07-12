import { GetEditor } from '../types';

function CustomStyleMapPlugin() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();
    hooks.createCustomStyleMap.tap('CustomStyleMapPlugin', () => ({
      CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
      },
      // https://draftjs.org/docs/advanced-topics-inline-styles/#mapping-a-style-string-to-css
      'STRIKE-THROUGH': {
        textDecoration: 'line-through',
      },
    }));
  };
}

export default CustomStyleMapPlugin;
