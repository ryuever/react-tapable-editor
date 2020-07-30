import Link from '../components/link';
import { GetEditor, DraftNodeDecoratorStrategy, DecoratorPair } from '../types';

function LinkDecorator() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();

    hooks.updateDecorator.tap(
      'LinkDecorator',
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
            return entityType === 'LINK';
          }, cb);
        };

        return pairs.concat({
          strategy,
          component: Link,
        });
      }
    );
  };
}

export default LinkDecorator;
