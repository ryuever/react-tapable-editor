import {
  Modifier,
  CharacterMetadata,
  EditorState,
  SelectionState,
} from 'draft-js'
import Immutable from 'immutable'

const OrderedSet = Immutable.OrderedSet;
var Repeat = Immutable.Repeat;

function StateFilterPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor();

    hooks.stateFilter.tap('StateFilterPlugin', (oldEditorState, editorState, pasteText) => {
      const oldBlockMap = oldEditorState.getCurrentContent().getBlockMap()
      const contentState = editorState.getCurrentContent()
      const blockMap = contentState.getBlockMap()
      const changeType = editorState.getLastChangeType()
      let newContentState = contentState

      // 解决的问题
      // 1. 当用户从vscode复制代码到编辑器中时，会保持原有的style
      // 2. TODO 如果说是从github上直接复制的代码的话，目前会存在所有的代码都被放置到一行的问题，目前能够
      //    想到的比较合适的解决方式就是，不再使用editorState中的block，通过`text`直接来创建新的block
      //    然后再插入到contentState中
      if (changeType === 'insert-fragment' && blockMap.size !== oldBlockMap.size) {
        const oldSelection = oldEditorState.getSelection()
        const oldStartKey = oldSelection.getStartKey()
        const oldStartBlock = oldBlockMap.get(oldStartKey)

        if (oldStartBlock.getType() !== 'code-block') return editorState

        const parts = pasteText.split('\n').filter(part => part !== '')
        let index = 0

        blockMap.skipUntil(function(block, key) {
          return key === oldStartKey
        }).takeUntil(function(block, key) {
          return key !== oldStartKey && !!oldBlockMap.get(key)
        }).toOrderedMap().map(function(block, key) {
          // 通过pasteText中的样式，来补充block中的样式
          const paddingLength = parts[index].length - block.getLength()
          // 如果不加paddingLength的话，默认情况下，indent是没有的。。。
          if (paddingLength) {
            newContentState = newContentState.merge({
              blockMap: newContentState.blockMap.set(key, block.merge({
                text: ' '.repeat(paddingLength) + block.getText(),
                characterList: Repeat(CharacterMetadata.create({
                  style: OrderedSet(),
                  entity: null
                }), paddingLength).toList().concat(block.getCharacterList()),
              }))
            })
          }

          const selection = new SelectionState({
            anchorKey: key,
            anchorOffset: 0,
            focusKey: key,
            focusOffset: newContentState.blockMap.get(key).getLength(),
            isBackward: false,
          })

          newContentState = Modifier.setBlockType(newContentState, selection, 'code-block')

          index++
        })

        const next = EditorState.push(editorState, newContentState, 'change-block-type')
        return EditorState.forceSelection(next, newContentState.getSelectionAfter())
      }

      return editorState
    });
  };
}

export default StateFilterPlugin