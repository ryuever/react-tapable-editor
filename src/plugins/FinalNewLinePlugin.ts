import { GetEditor, ContentBlockNode, BlockNodeMap } from '../types';
import createEmptyBlockNode from '../utils/block/createEmptyBlockNode';
import { EditorState } from 'draft-js';

function FinalNewLinePlugin() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();

    hooks.finalNewLine.tap('finalNewLine', (editorState: EditorState) => {
      const currentState = editorState.getCurrentContent();
      const blockMap = currentState.getBlockMap() as BlockNodeMap;
      const last = blockMap.last<ContentBlockNode>();

      const type = last.getType();
      const parent = last.getParentKey();

      if (
        parent /** the last block is not the top-most component */ ||
        type !== 'unstyled'
      ) {
        const emptyBlock = createEmptyBlockNode();
        const key = emptyBlock.getKey();

        const lastBlockWithNullParent = blockMap
          .reverse()
          .toSeq()
          .skipUntil(function(block) {
            return !block.getParentKey();
          })
          .first<ContentBlockNode>();

        if (lastBlockWithNullParent) {
          const newBlock = emptyBlock.merge({
            prevSibling: lastBlockWithNullParent.getKey(),
          });
          let newBlockMap = blockMap.set(
            lastBlockWithNullParent.getKey(),
            lastBlockWithNullParent.merge({
              nextSibling: key,
            })
          );

          newBlockMap = newBlockMap
            .toSeq()
            .concat([[key, newBlock]])
            .toOrderedMap();
          const newContent = (currentState as any).set('blockMap', newBlockMap);
          return EditorState.push(editorState, newContent, 'insert-characters');
        }
      }

      return editorState;
    });
  };
}

export default FinalNewLinePlugin;
