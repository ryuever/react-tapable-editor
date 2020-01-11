import LinkSpan from '../components/link-span'

function LinkSpanDecoratorPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor();

    hooks.updateDecorator.tap('LinkSpanDecoratorPlugin', (pairs = [], editorState) => {
      const selection = editorState.getSelection()
      const hasFocus = selection.getHasFocus()
      const isCollapsed = selection.isCollapsed()

      if (true) {
      // if (!hasFocus && !isCollapsed) {
        const strategy = (contentBlock, cb, contentState) => {
          if (!contentState) return;
          contentBlock.findEntityRanges(character => {
            const entityKey = character.getEntity();

            if (!entityKey) return false
            const entityType = contentState.getEntity(entityKey).getType()


            return entityType === 'LINK_SPAN'
          }, (start, end) => {
            cb(start, end)
          });
        }

        return [].concat({
          strategy,
          component: LinkSpan,
        }, pairs)
      }

      return pairs
    });
  };
}

export default LinkSpanDecoratorPlugin