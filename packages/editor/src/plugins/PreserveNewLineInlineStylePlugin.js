export default () => {
  this.apply = getState => {
    const { hooks } = getState

    hooks.handleKeyCommand.tap('PreserveNewLineInlineStylePlugin', (command, editorState) => {
      if (command === 'split-block') {
        const selection = editorState.getSelection()
        const currentContent = editorState.getCurrentContent()
        const endKey = selection.getEndKey()
        const block = currentContent.getBlockForKey(endKey)
        const size = block.getLength()
        const focusOffset = selection.getFocusOffset()

        console.log('focusOffset : ', focusOffset, size)
        if (focusOffset === size) {
          const inlineStyle = editorState.getCurrentInlineStyle()
          console.log('inline : ', inlineStyle)

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

          // this.setState({
          //   editorState: nextState,
          // })

          hooks.onChange.call(nextState)

          return true
        }
      }
    })
  }
}