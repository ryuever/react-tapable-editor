import DragDropManager from './DragDropManager'

function DragPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor()
    const manager = new DragDropManager(getEditor)

    hooks.prepareDragStart.tap('DragPlugin', sourceBlockKey => {
      manager.prepare(sourceBlockKey)
    })

    hooks.teardownDragDrop.tap('DragPlugin', () => {
      manager.teardown()
    })
  }
}

export default DragPlugin