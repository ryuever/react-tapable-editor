// 主要是为了解决在`isInCompositionMode`模式下，进行`inlineStyle`切换的时候，会出现
// 刚刚触发的`inlineStyle`变化并不会作用到接下来的输入的问题。目前的处理方式就是在
// toggle inline style以及换行的时候，默认添加一个`\u200B`字符
import { Modifier, EditorState } from 'draft-js';

function StyleControlPlugin() {
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
        }

        const next = EditorState.push(nextEditorState, newCurrentState, action)
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
  };
}

export default StyleControlPlugin;
