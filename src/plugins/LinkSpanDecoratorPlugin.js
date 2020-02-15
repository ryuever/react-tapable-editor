import LinkSpan from '../components/link-span'

function LinkSpanDecoratorPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor();

    hooks.updateDecorator.tap('LinkSpanDecoratorPlugin', (pairs = [], editorState) => {
      const strategy = (contentBlock, cb, contentState) => {
        if (!contentState) return;
        contentBlock.findEntityRanges(character => {
          const entityKey = character.getEntity();

          if (!entityKey) return false
          const entityType = contentState.getEntity(entityKey).getType()

          return entityType === 'LINK_SPAN'
        }, cb);
      }

      return [].concat({
        strategy,
        component: LinkSpan,
      }, pairs)
    });
  };
}

export default LinkSpanDecoratorPlugin