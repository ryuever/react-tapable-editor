import {
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js"
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import { hasText } from '../utils/contentBlock'

// 解决的场景问题：新打开的文档尚未输入问题，这个时候如果我们触发了style
// 的变化（block和inline）也应该应用到`placeholder`

function PlaceholderPlugin() {
  this.placeholder = null
  this.placeholderBlock = null
  this.placeholderNode = null
  this.selection = null

  this.apply = getEditor => {
    const { hooks, editorRef } = getEditor()

    hooks.handleKeyCommand.tap('PlaceholderPlugin', (command, editorState) => {
      const contentState = editorState.getCurrentContent()
      const selection = editorState.getSelection()
      const blockMap = contentState.getBlockMap()

      const onlyHasTwoBlocks= blockMap.size === 2
      console.log('command : ', command)
      if (!this.placeholderBlock) return

      if (onlyHasTwoBlocks) {
        const anchorOffset = selection.getAnchorOffset()
        const focusOffset = selection.getFocusOffset()
        if (selection.isCollapsed() && anchorOffset === focusOffset && !anchorOffset) {
          const commands = [
            // 不能够禁掉`split-block`；否则当只有一个空行的时候，敲enter键就没啥用了
            // 'split-block',
            'backspace',
          ]
          if (commands.indexOf(command) !== -1) {
            return 'handled'
          }
        }
      }
    })

    hooks.toggleBlockType.tap('PlaceholderPlugin', (newEditorState, editorState, blockType) => {
      const currentEditorState = newEditorState || editorState
      const currentContent = currentEditorState.getCurrentContent()
      if (!this.placeholderBlock) return
      const firstBlock = currentContent.getFirstBlock()
      const firstBlockKey = firstBlock.getKey()
      const selection = editorState.getSelection()
      this.selection = selection
      const hasFocus = currentEditorState.getSelection().getHasFocus();

      const newSelection = new SelectionState({
        anchorKey: firstBlockKey,
        anchorOffset: 0,
        focusKey: firstBlockKey,
        focusOffset: 0,
        isBackward: false
      })

      editorRef.current.blur()

      if (hasFocus) {
        const typeToSet = firstBlock.getType() === blockType ? 'unstyled' : blockType;
        const blurSelection = newSelection.set('hasFocus', false)
        const next = EditorState.push(
          currentEditorState,
          Modifier.setBlockType(currentContent, selection, typeToSet),
          'change-block-type'
        );
        return EditorState.acceptSelection(next, blurSelection)
      }

      return null
    })

    // updatePlaceholder会在`mount`和`didUpdate`的时候都会触发
    hooks.updatePlaceholder.tap('PlaceholderPlugin', (editorState, placeholder) => {
      const contentState = editorState.getCurrentContent()
      const selection = editorState.getSelection()
      const blockMap = contentState.getBlockMap()
      const firstBlock = contentState.getFirstBlock()
      const firstBlockKey = firstBlock.getKey()
      const blockSize = blockMap.size
      const isInCompositionMode = editorState.isInCompositionMode()

      if (blockSize > 2 && this.placeholderBlock) {
        const newBlockMap = contentState.getBlockMap()["delete"](firstBlockKey);
        const withoutFirstBlock = contentState.merge({
          blockMap: newBlockMap,
          selectionAfter: selection
        });
        this.placeholderBlock = null
        this.placeholderNode = null
        hooks.setState.call(EditorState.push(editorState, withoutFirstBlock, 'remove-range'))
        return
      }

      if (blockSize === 2) {
        const firstBlockKey = firstBlock.getKey()
        const secondBlock = contentState.getBlockAfter(firstBlockKey)
        // 证明
        if (this.placeholderBlock && firstBlockKey === this.placeholderBlock.getKey()) {
          // 两种情况，首先输入字符的时候，直接将block移除；还有就是当是IME input时同样需要将第一个block删除
          // `isInCompositionMode` 的设置可以参考`editOnCompositionStart.js`
          if (hasText(secondBlock) || isInCompositionMode) {
            // 参考`RichTextEditorUtil/onBackspace` function
            const newBlockMap = contentState.getBlockMap()["delete"](firstBlockKey);

            // 1. 当在`isInCompositionMode`如果不设置`selectionAfter`的话，当确定
            // 比如中文输入完以后，这个时候指针会回退到刚刚输入中文时的指针位置；与不设置
            // selectionAfter相比，selection的字段`hasFocus = true`这个也是为啥
            // 当中文输入结束时，指针还在最后的位置
            // 2. 之所以+1；因为在实际使用中，如果输入中文的话，它第一次的指针显示位置是不对的
            const withoutFirstBlock = contentState.merge({
              blockMap: newBlockMap,
              selectionAfter: selection.merge({
                anchorOffset: 1,
                focusOffset: 1,
              })
            });
            this.placeholderBlock = null
            this.placeholderNode = null
            hooks.setState.call(EditorState.push(
              editorState,
              withoutFirstBlock,
              'remove-range'
            ))
            return
          } else {
            // 下面的情形是针对当用户什么都没有输入时，触发了`blockType`的改变
            const offsetKey = DraftOffsetKey.encode(firstBlockKey, 0, 0);
            const node = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0];

            if (node) {
              node.style.color = '#9197a3'
              node.style.position = 'absolute'
            }
            if (this.selection && !editorState.getSelection().getHasFocus()) {
              hooks.setState.call(EditorState.forceSelection(
                editorState,
                this.selection
              ))
              return
            }
          }
        }
      }

      // 如果说没有内容的时候，会插入当前的内容
      if(!contentState.hasText()
        && placeholder
        && !this.placeholderBlock
        && !isInCompositionMode
      ){
        this.placeholder = placeholder
        const newContent = Modifier.insertText(
          contentState,
          selection,
          placeholder,
        );

        this.placeholderBlock = firstBlock
        const newSelection = new SelectionState({
          anchorKey: firstBlockKey,
          anchorOffset: placeholder.length,
          focusKey: firstBlockKey,
          focusOffset: placeholder.length,
          isBackward: false
        })

        const next = Modifier.splitBlock(newContent, newSelection);
        const offsetKey = DraftOffsetKey.encode(firstBlockKey, 0, 0);

        // 不能够直接对DOM进行attribution的设置；当你输入中文的时候，会将你刚才所有的`attribution`
        // 设置还原
        this.placeholderNode = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0];

        if (this.placeholderNode) {
          this.placeholderNode.style.color = '#9197a3'
          this.placeholderNode.style.position = 'absolute'
        }

        const newEditorState = EditorState.push(
          editorState,
          next,
          'split-block'
        )

        const newCurrentContent = newEditorState.getCurrentContent()
        const secondBlockKey = newCurrentContent.getKeyAfter(firstBlockKey)
        const secondBlockHeadingSelection = new SelectionState({
          anchorKey: secondBlockKey,
          anchorOffset: 0,
          focusKey: secondBlockKey,
          focusOffset: 0,
          isBackward: false
        })

        // EditorState.forceSelection 返回的是一个光标放置在指定selection的`editorState`
        hooks.setState.call(EditorState.forceSelection(
          newEditorState,
          secondBlockHeadingSelection
        ))
      }
    })
  }
}

export default PlaceholderPlugin