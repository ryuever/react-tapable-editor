import LinkSpan from '../components/link-span';
import { GetEditor, DraftNodeDecoratorStrategy, DecoratorPair } from '../types';

function LinkSpanDecoratorPlugin() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();

    hooks.updateDecorator.tap(
      'LinkSpanDecoratorPlugin',
      (pairs: DecoratorPair[] = []) => {
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

        return pairs.concat({
          strategy,
          component: LinkSpan,
        });
      }
    );
  };
}

export default LinkSpanDecoratorPlugin;
