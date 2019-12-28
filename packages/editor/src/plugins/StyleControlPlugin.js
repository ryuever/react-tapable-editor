// 主要是为了解决在`isInCompositionMode`模式下，进行`inlineStyle`切换的时候，会出现
// 刚刚触发的`inlineStyle`变化并不会作用到接下来的输入的问题。目前的处理方式就是在
// toggle inline style以及换行的时候，默认添加一个`\u200B`字符
import { Modifier, EditorState, SelectionState } from 'draft-js';

function StyleControlPlugin() {
  const selectionWithNonWidthCharacter = {}

  this.apply = (getState) => {
    const { hooks } = getState();

    // 1. 首先判断是在`isCollapsed`模式下
    // 2. 查看触发`inlineStyle`变化位置的前一个字符是否是`\u200B`，如果是的话，就将新的
    //    inlineStyle应用到它上面，否则就插入一个`\u200B`字符
    hooks.afterInlineStyleApplied.tap('StyleControlPlugin', (newEditorState, editorState, inlineStyle) => {
      const nextEditorState = newEditorState || editorState
      const currentContent = nextEditorState.getCurrentContent()
      const selection = nextEditorState.getSelection()
      const currentInlineStyle = nextEditorState.getCurrentInlineStyle()
      if (selection.isCollapsed()) {
        const startKey = selection.getStartKey()
        const anchorOffset = selection.getAnchorOffset()
        const block = currentContent.getBlockForKey(startKey)

        // 查看一下最后的字符是否是`\u200B`;如果是的话，则直接将它替换掉，而不是再添加一个
        const len = block.getLength()
        const text = block.getText()
        const lastCharacter = text[len - 1]
        let newCurrentState
        let action
        let markerSelection

        if (lastCharacter === '\u200B') {
          markerSelection = selection.merge({
            anchorOffset: len - 1,
            focusOffset: len,
          })
          newCurrentState = Modifier.applyInlineStyle(
            currentContent,
            markerSelection,
            inlineStyle,
          )
          action = 'change-inline-style'
        } else {
          markerSelection = selection
          newCurrentState = Modifier.insertText(
            currentContent,
            selection,
            "\u200B",
            currentInlineStyle,
            null,
          )
          action = 'insert-characters'

          if (!selectionWithNonWidthCharacter[startKey]) selectionWithNonWidthCharacter[startKey] = {}
          const group = selectionWithNonWidthCharacter[startKey]
          group[anchorOffset] = selection
        }

        const next = EditorState.push(nextEditorState, newCurrentState, action)
        // 如果不设置forceSelection的话，当触发`inlineStyle`改变的时候，光标并不会被
        // 放置到新插入的`\u200B`的后面；如果不进行`forceSelection`的话，只能够是通过光标移动来解决了
        return EditorState.forceSelection(next, newCurrentState.getSelectionAfter())
      }
      return null
    })

    // 存在的问题，新开一个editor，然后只是敲入几行空格，最后再`backspace`删除直到第一行的时候
    // 切换成中文输入法然后输入东西会报错；
    hooks.handleKeyCommand.tap('StyleControlPlugin', (command, editorState) => {
      // if (command === 'split-block') {
      //   const selection = editorState.getSelection();
      //   const currentContent = editorState.getCurrentContent();
      //   const endKey = selection.getEndKey();
      //   const block = currentContent.getBlockForKey(endKey);
      //   const size = block.getLength();
      //   const focusOffset = selection.getFocusOffset();

      //   if (focusOffset === size) {
      //     const inlineStyle = editorState.getCurrentInlineStyle();
      //     const endOffset = selection.getFocusOffset();
      //     const entityKey = block.getEntityAt(endOffset);

      //     const nextContent = Modifier.replaceText(
      //       editorState.getCurrentContent(),
      //       selection,
      //       '\u200B',
      //       inlineStyle,
      //       entityKey,
      //     );

      //     const nextState = EditorState.push(editorState, Modifier.splitBlock(
      //       nextContent,
      //       selection,
      //     ), 'split-block');

      //     hooks.setState.call(nextState);

      //     return true;
      //   }
      // }
    });

    hooks.didUpdate.tap('RemoveLastNonWidthCharacterPlugin', (editorState) => {
      // return
      const selection = editorState.getSelection();
      const currentState = editorState.getCurrentContent();
      const selectionBefore = currentState.getSelectionBefore()
      const isInCompositionMode = editorState.isInCompositionMode();

      if (selection.isCollapsed() && !isInCompositionMode) {
        const currentSelectionPosition = selection.getAnchorOffset()
        const currentStartKey = selection.getStartKey()
        const group = selectionWithNonWidthCharacter[currentStartKey]
        if (group) {
          const keys = Object.keys(group)

          const newState = keys.reduce((es, key) => {
            const markerSelection = group[key]
            const content = es.getCurrentContent()
            const markerSelectionPosition = markerSelection.getAnchorOffset()
            console.log('markerSelectionPosition : ',
              selectionWithNonWidthCharacter,
              markerSelectionPosition,
              currentSelectionPosition
            )
            if (Math.abs(markerSelectionPosition - currentSelectionPosition) <= 1) return es
            const newContent = Modifier.removeRange(
              content,
              markerSelection.merge({
                focusOffset: markerSelectionPosition + 1,
              }),
              'backward',
            );
            delete group[key];

            // 通过设置新的`selectionAfter`为了解决，当比如中文输入完以后，光标应该回到哪个位置；
            // 如果没有这个的设置的话，光标会被放置到刚刚输入中文开始的位置。
            // const newState = EditorState.push(editorState, newContent, 'delete-character')
            const newState = EditorState.push(editorState, newContent.set(
              'selectionAfter',
              new SelectionState({
                anchorKey: currentStartKey,
                anchorOffset: selection.getAnchorOffset() - 1,
                focusKey: currentStartKey,
                focusOffset: selection.getAnchorOffset() - 1,
                isBackward: false,
                hasFocus: true,
              })
            ), 'delete-character')

            return newState
            // const newState = EditorState.push(editorState, newContent.set('selectionAfter', selection), 'delete-character')
            // return EditorState.forceSelection(newState, es.getSelection())
          }, editorState)

          if (newState && newState !== editorState) hooks.setState.call(newState)
        }
      }
    });
  };
}

export default StyleControlPlugin;
