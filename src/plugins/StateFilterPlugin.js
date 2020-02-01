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

      console.log('old block map ', oldBlockMap, blockMap)
      if (changeType === 'insert-fragment' && blockMap.size !== oldBlockMap.size) {
        try {
          const oldSelection = oldEditorState.getSelection()
          const oldStartKey = oldSelection.getStartKey()
          const oldStartBlock = oldBlockMap.get(oldStartKey)

          if (oldStartBlock.getType() !== 'code-block') return editorState

          const parts = pasteText.split('\n').filter(part => part !== '')
          console.log('parts 1: ', parts)
          let index = 0
          let newBlockMap = blockMap

          blockMap.skipUntil(function(block, key) {
            return key === oldStartKey
          }).takeUntil(function(block, key) {
            return key !== oldStartKey && !!oldBlockMap.get(key)
          }).toOrderedMap().map(function(block, blockKey) {
            // 通过pasteText中的样式，来补充block中的样式
            const blockText = block.getText()
            const originText = parts[index]

            if (blockText.trim() === originText.trim()) {
              const paddingLength = originText.length - block.getLength()
              if (paddingLength) {
                const newBlock = block.merge({
                  type: 'code-block',
                  text: ' '.repeat(paddingLength) + block.getText(),
                  characterList: Repeat(CharacterMetadata.create({
                    style: OrderedSet(),
                    entity: null
                  }), paddingLength).toList().concat(block.getCharacterList()),
                })
                newBlockMap = newBlockMap.set(blockKey, newBlock)
              }
              index++
            }

            // console.log('parts 2 : ', parts[index], block, block.getText())
            // const paddingLength = parts[index].length - block.getLength()
            // console.log('paddingLength  :', paddingLength)
            // // 如果不加paddingLength的话，默认情况下，indent是没有的。。。
            // if (paddingLength > 0) {
            //   newContentState = newContentState.merge({
            //     blockMap: newContentState.blockMap.set(key, block.merge({

            //     }))
            //   })
            // }

            // const selection = new SelectionState({
            //   anchorKey: key,
            //   anchorOffset: 0,
            //   focusKey: key,
            //   focusOffset: newContentState.blockMap.get(key).getLength(),
            //   isBackward: false,
            // })

            // newContentState = Modifier.setBlockType(newContentState, selection, 'code-block')

            // index++
          })

          const newContent = contentState.merge({
            blockMap: newBlockMap,
          })

          const next = EditorState.push(editorState, newContent, 'change-block-type')
          return EditorState.forceSelection(next, newContent.getSelectionAfter())
        } catch (err) {
          console.error('stateFilterPlugin : ', err)
        }
      }

      return editorState
    });
  };
}

export default StateFilterPlugin