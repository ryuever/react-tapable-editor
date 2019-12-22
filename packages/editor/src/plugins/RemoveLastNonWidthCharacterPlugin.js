import { Modifier, EditorState } from 'draft-js';

function PreserveNewLineInlineStylePlugin() {
  const selectionWithNonWidthCharacter = {}
  this.apply = getState => {
    const { hooks } = getState()

    hooks.didUpdate.tap('RemoveLastNonWidthCharacterPlugin', editorState => {
      const selection = editorState.getSelection()
      if (selection.isCollapsed()) {
        const startKey = selection.getStartKey()
        const contentState = editorState.getCurrentContent()
        const block = contentState.getBlockForKey(startKey)
        const size = block.getLength()
        if (selectionWithNonWidthCharacter[startKey]) {
          const markerOffset = selectionWithNonWidthCharacter[startKey].getFocusOffset()
          if (markerOffset >= size - 1) return
          const newContent = Modifier.removeRange(
            editorState.getCurrentContent(),
            selectionWithNonWidthCharacter[startKey].merge({
              focusOffset: markerOffset + 1,
            }),
            'backward'
          )
          delete selectionWithNonWidthCharacter[startKey]

          const es = EditorState.push(editorState, newContent, 'delete-character')
          const newEditorState = EditorState.forceSelection(es, selection.merge({
            anchorKey: startKey,
            anchorOffset: selection.getAnchorOffset() - 1,
            focusKey: startKey,
            focusOffset: selection.getAnchorOffset() - 1,
            isBackward: false,
            hasFocus: true
          }))

          hooks.onChange.call(newEditorState)
        }
      }
    })
  }
}

export default PreserveNewLineInlineStylePlugin