import { Modifier, EditorState } from 'draft-js';

function PreserveNewLineInlineStylePlugin() {
  this.apply = getState => {
    const { hooks } = getState()

    hooks.handleKeyCommand.tap('PreserveNewLineInlineStylePlugin', (command, editorState) => {
      if (command === 'split-block') {
        const selection = editorState.getSelection()
        const currentContent = editorState.getCurrentContent()
        const endKey = selection.getEndKey()
        const block = currentContent.getBlockForKey(endKey)
        const size = block.getLength()
        const focusOffset = selection.getFocusOffset()

        if (focusOffset === size) {
          const inlineStyle = editorState.getCurrentInlineStyle()
          const endOffset = selection.getFocusOffset()
          const entityKey = block.getEntityAt(endOffset)

          const nextContent = Modifier.replaceText(
            editorState.getCurrentContent(),
            selection,
            "\u200B",
            inlineStyle,
            entityKey,
          )

          const nextState = EditorState.push(editorState, Modifier.splitBlock(
            nextContent,
            selection,
          ), 'split-block');

          hooks.setState.call(nextState)

          return true
        }
      }
    })
  }
}

export default PreserveNewLineInlineStylePlugin