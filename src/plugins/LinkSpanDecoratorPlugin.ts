import LinkSpan from '../components/link-span';
import { GetEditor, DraftNodeDecoratorStrategy } from '../types';

function LinkSpanDecoratorPlugin() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();

    hooks.updateDecorator.tap('LinkSpanDecoratorPlugin', (pairs = []) => {
      const strategy: DraftNodeDecoratorStrategy = (
        contentBlock,
        cb,
        contentState
      ) => {
        if (!contentState) return;
        contentBlock.findEntityRanges(character => {
          const entityKey = character.getEntity();

          if (!entityKey) return false;
          const entityType = contentState.getEntity(entityKey).getType();

          return entityType === 'LINK_SPAN';
        }, cb);
      };

      return [].concat(
        {
          strategy,
          component: LinkSpan,
        },
        pairs
      );
    });
  };
}

export default LinkSpanDecoratorPlugin;
