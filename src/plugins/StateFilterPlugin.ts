import { CharacterMetadata, EditorState } from 'draft-js';
import { Repeat, OrderedSet } from 'immutable';
import removeBlock from '../utils/block/removeBlock';
import flattenBlocks from '../utils/block/flattenBlocks';
import {
  GetEditor,
  ContentBlockNode,
  BlockNodeMap,
  ContentNodeState,
} from '../types';

function StateFilterPlugin() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();

    hooks.stateFilter.tap(
      'StateFilterPlugin',
      (
        oldEditorState: EditorState,
        editorState: EditorState,
        pasteText: string
      ) => {
        const oldBlockMap = oldEditorState
          .getCurrentContent()
          .getBlockMap() as BlockNodeMap;
        const contentState = editorState.getCurrentContent() as ContentNodeState;
        const blockMap = contentState.getBlockMap() as BlockNodeMap;
        const changeType = editorState.getLastChangeType();

        // 解决的问题
        // 1. 当用户从vscode复制代码到编辑器中时，会保持原有的style
        // 2. TODO 如果说是从github上直接复制的代码的话，目前会存在所有的代码都被放置到一行的问题，目前能够
        //    想到的比较合适的解决方式就是，不再使用editorState中的block，通过`text`直接来创建新的block
        //    然后再插入到contentState中

        if (
          changeType === 'insert-fragment' &&
          blockMap.size !== oldBlockMap.size
        ) {
          try {
            const oldSelection = oldEditorState.getSelection();
            const oldStartKey = oldSelection.getStartKey();
            const oldStartBlock = oldBlockMap.get(oldStartKey);

            if (!oldStartBlock) return editorState;
            if (oldStartBlock.getType() !== 'code-block') return editorState;

            const parts = pasteText.split('\n').filter(part => part !== '');
            let index = 0;
            let newBlockMap = blockMap;

            let blockKeyHasChildren;
            let lastBlockKey = '';

            blockMap
              .skipUntil((_: any, key: string) => key === oldStartKey)
              .takeUntil(
                (_: any, key: string) =>
                  key !== oldStartKey && !!oldBlockMap.get(key)
              )
              .toOrderedMap()
              .forEach(function(block: ContentBlockNode, blockKey: string) {
                lastBlockKey = blockKey;
                // 通过pasteText中的样式，来补充block中的样式
                const blockText = block.getText();
                const originText = parts[index];

                const childKeys = block.getChildKeys().toArray();
                if (childKeys.length) {
                  blockKeyHasChildren = blockKey;
                  return;
                }

                if (blockText.trim() === originText.trim()) {
                  const paddingLength = originText.length - block.getLength();
                  if (paddingLength) {
                    const newBlock = block.merge({
                      parent: null,
                      type: 'code-block',
                      text: ' '.repeat(paddingLength) + block.getText(),
                      characterList: Repeat(
                        CharacterMetadata.create({
                          style: OrderedSet(),
                          entity: undefined,
                        }),
                        paddingLength
                      )
                        .toList()
                        .concat(block.getCharacterList()),
                    });
                    newBlockMap = newBlockMap.set(blockKey, newBlock);
                  }
                  index++;
                } else {
                  const newBlock = block.merge({
                    parent: null,
                    type: 'code-block',
                  });
                  newBlockMap = newBlockMap.set(blockKey, newBlock);
                }
              });

            if (blockKeyHasChildren) {
              newBlockMap = removeBlock(newBlockMap, blockKeyHasChildren);
            }

            newBlockMap = flattenBlocks(newBlockMap, oldStartKey, lastBlockKey);
            const newContent = contentState.merge({ blockMap: newBlockMap });
            const next = EditorState.push(
              editorState,
              newContent,
              'change-block-type'
            );
            return EditorState.forceSelection(
              next,
              newContent.getSelectionAfter()
            );
          } catch (err) {
            console.error('stateFilterPlugin : ', err);
          }
        }

        return editorState;
      }
    );
  };
}

export default StateFilterPlugin;
