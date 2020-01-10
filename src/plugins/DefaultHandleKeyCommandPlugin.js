// 解决的问题
// 1. 首先判断`hasText()`；如果说开头是一个`\u200B`字符的话，很大程度就是为了inlineStyle
// 2. toggleInlineStyle 和 `blockStyle`
// 3. 对atomic entity怎么处理？

// https://github.com/facebook/draft-js/blob/master/examples/draft-0-9-1/rich/rich.html#L52
// https://github.com/facebook/draft-js/blob/master/src/model/modifier/RichTextEditorUtil.js#L54
import { RichUtils } from 'draft-js'

function DefaultHandleKeyCommandPlugin(command, editorState) {
  this.apply = getEditor => {
    const { hooks } = getEditor()
    hooks.handleKeyCommand.tap('HandleBackspaceOnStartOfBlockPlugin', (command, editorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        hooks.setState.call(newState)
        return 'handled'
      }
    })
  }
}

export default DefaultHandleKeyCommandPlugin