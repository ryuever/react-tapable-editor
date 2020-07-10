import Link from '../components/link';

function LinkDecorator() {
  this.apply = getEditor => {
    const { hooks } = getEditor();

    hooks.updateDecorator.tap('LinkDecorator', (pairs = [], editorState) => {
      const strategy = (contentBlock, cb, contentState) => {
        if (!contentState) return;
        contentBlock.findEntityRanges(character => {
          const entityKey = character.getEntity();
          if (!entityKey) return false;
          const entityType = contentState.getEntity(entityKey).getType();
          return entityType === 'LINK';
        }, cb);
      };

      return [].concat(
        {
          strategy,
          component: Link,
        },
        pairs
      );
    });
  };
}

export default LinkDecorator;
