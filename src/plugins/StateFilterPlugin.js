import { CharacterMetadata, EditorState } from 'draft-js'
import removeBlock from '../utils/block/removeBlock'
import {
  Repeat,
  OrderedSet,
  OrderedMap,
} from 'immutable'

function StateFilterPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor();

    hooks.stateFilter.tap('StateFilterPlugin', (oldEditorState, editorState, pasteText) => {
      const oldBlockMap = oldEditorState.getCurrentContent().getBlockMap()
      const contentState = editorState.getCurrentContent()
      const blockMap = contentState.getBlockMap()
      const changeType = editorState.getLastChangeType()

      const lastBlock = contentState.getLastBlock()
      const endKey = lastBlock.getKey()

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

          console.log('editor state : ', editorState)
          let blockKeyHasChildren
          let lastBlockKey

          blockMap.skipUntil(function(block, key) {
            return key === oldStartKey
          }).takeUntil(function(block, key) {
            return key !== oldStartKey && !!oldBlockMap.get(key)
          }).toOrderedMap().map(function(block, blockKey) {
            lastBlockKey = blockKey
            // 通过pasteText中的样式，来补充block中的样式
            const blockText = block.getText()
            const originText = parts[index]

            const childKeys = block.getChildKeys().toArray()
            if (childKeys.length) {
              blockKeyHasChildren = blockKey
              return
            }

            if (blockText.trim() === originText.trim()) {
              const paddingLength = originText.length - block.getLength()
              if (paddingLength) {
                const newBlock = block.merge({
                  parent: null,
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
            } else {
              const newBlock = block.merge({
                parent: null,
                type: 'code-block',
              })
              newBlockMap = newBlockMap.set(blockKey, newBlock)
            }
          })
          console.log('block ', blockKeyHasChildren)

          if (blockKeyHasChildren) {
            // const block = newBlockMap.get(blockKeyHasChildren)
            // const childKeys = block.getChildKeys().toArray()
            // const firstBlockKey = childKeys[0]
            // const firstBlock = newBlockMap.get(firstBlockKey)

            // const prevSiblingKey = block.getPrevSiblingKey()

            // const newFirstBlock = firstBlock.merge({
            //   prevSibling: prevSiblingKey,
            // })
            // newBlockMap = newBlockMap.set(firstBlockKey, newFirstBlock)

            // const prevSiblingBlock = newBlockMap.get(prevSiblingKey)
            // const newPrevSiblingBlock = prevSiblingBlock.merge({
            //   nextSibling: firstBlockKey,
            // })
            // newBlockMap = newBlockMap.set(prevSiblingKey, newPrevSiblingBlock)

            // console.log('new block ', newBlockMap, firstBlockKey, prevSiblingKey)

            newBlockMap = removeBlock(newBlockMap, blockKeyHasChildren)
          }

          const blocksBefore = newBlockMap
            .toSeq()
            .takeUntil((_, key) => key === oldStartKey)
          const blocksAfter = newBlockMap
            .toSeq()
            .skipUntil((_, key) => key === lastBlockKey)
            .takeUntil((_, k) => k === endKey).concat([[endKey, blockMap.get(endKey)]])
          const blocks = newBlockMap
            .toSeq()
            .skipUntil((_, key) => key === oldStartKey)
            .takeUntil((_, key) => key === lastBlockKey)
            .reduce((acc, currentBlock) => {
              const last = acc.toSeq().last()

              console.log('last ', acc, currentBlock.getKey())
              const currentBlockKey = currentBlock.getKey()
              if (last) {
                console.log('lst ', last.getKey())

                const lastBlockKey = last.getKey()
                const lastBlock = acc.get(lastBlockKey)
                const newLastBlock = lastBlock.merge({
                  nextSibling: currentBlockKey
                })
                acc = acc.set(lastBlockKey, newLastBlock)
                const newCurrentBlock = currentBlock.merge({
                  prevSibling: lastBlockKey
                })
                acc = acc.set(currentBlockKey, newCurrentBlock)
              } else {
                acc = acc.set(currentBlockKey, currentBlock)
              }

              return acc
            }, new OrderedMap())

          newBlockMap = blocksBefore.concat(blocks, blocksAfter).toOrderedMap();

          console.log('new block : ', blocksBefore.toArray(), blocksAfter.toArray(), blocks.toArray(), newBlockMap.toArray())

          const newContent = contentState.merge({
            blockMap: newBlockMap,
          })

          const next = EditorState.push(editorState, newContent, 'change-block-type')
          console.log('next - ', next.getCurrentContent().getBlockMap())
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