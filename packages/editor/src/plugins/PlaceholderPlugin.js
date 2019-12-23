import {
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
  AtomicBlockUtils,
} from "draft-js"
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

// 解决的场景问题：新打开的文档尚未输入问题，这个时候如果我们触发了style
// 的变化（block和inline）也应该应用到`placeholder`

function PlaceholderPlugin() {
  this.placeholder = null
  this.placeholderBlock = null
  this.placeholderNode = null
  this.selection = null

  this.apply = getEditor => {
    const { hooks, editorRef } = getEditor()

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

      // 判断光标是否在`editor`中处于激活状态
      // if (hasFocus) {
      //   const next = EditorState.acceptSelection(currentEditorState, newSelection)
      //   const newNext = RichUtils.toggleBlockType(next, blockType)
      //   return EditorState.acceptSelection(newNext, selection)
      // }

      console.log('first : ', firstBlock, currentEditorState)

      console.log('ref : ', editorRef)
      editorRef.current.blur()
      if (hasFocus) {
        const typeToSet = currentContent.getBlockForKey(firstBlockKey).getType() === blockType ? 'unstyled' : blockType;
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

      const onlyHasTwoBlocks= blockMap.size === 2
      if (onlyHasTwoBlocks) {
        const firstBlockKey = firstBlock.getKey()
        const secondBlock = contentState.getBlockAfter(firstBlockKey)

        // 证明
        if (this.placeholderBlock && firstBlockKey === this.placeholderBlock.getKey()) {
          // 两种情况，首先输入字符的时候，直接将block移除；还有就是当是IME input时同样需要将第一个block删除
          // `isInCompositionMode` 的设置可以参考`editOnCompositionStart.js`
          if (secondBlock.getText() !== '' || editorState.isInCompositionMode()) {
            // 参考`RichTextEditorUtil/onBackspace` function
            const newBlockMap = contentState.getBlockMap()["delete"](firstBlockKey);
            const withoutFirstBlock = contentState.merge({
              blockMap: newBlockMap,
              selectionAfter: selection
            });
            this.placeholderBlock = null
            this.placeholderNode = null
            hooks.setState.call(EditorState.push(editorState, withoutFirstBlock, 'remove-range'))
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
              hooks.setState.call(EditorState.forceSelection(editorState, this.selection))
            }
          }
        }
      }

      // 如果说没有内容的时候，会插入当前的内容
      if(!contentState.hasText() && placeholder && !editorState.isInCompositionMode()) {
        console.log('y')
        this.placeholder = placeholder
        const selection = editorState.getSelection()
        const contentState = editorState.getCurrentContent()
        const newContent = Modifier.insertText(
          contentState,
          selection,
          placeholder,
        );

        const firstBlock = contentState.getFirstBlock()
        const firstBlockKey = firstBlock.getKey()
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
        hooks.setState.call(EditorState.forceSelection(newEditorState, secondBlockHeadingSelection))
      }
    })
  }
}

export default PlaceholderPlugin