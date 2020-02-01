import { EditorState } from 'draft-js'
import DragDropManager from './DragDropManager'
import transferBlock from '../../utils/block/transferBlock'

function DragPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor()
    const manager = new DragDropManager({
      getEditor,
      onUpdate: ({ targetBlockKey, sourceBlockKey }) => {
        const { editorState } = getEditor()
        const newContent = transferBlock(editorState, sourceBlockKey, targetBlockKey, 'left')
        const newState = EditorState.push(editorState, newContent)
        hooks.setState.call(newState)
      }
    })

    hooks.prepareDragStart.tap('DragPlugin', sourceBlockKey => {
      manager.prepare(sourceBlockKey)
    })

    hooks.teardownDragDrop.tap('DragPlugin', () => {
      manager.teardown()
    })
  }
}

export default DragPlugin