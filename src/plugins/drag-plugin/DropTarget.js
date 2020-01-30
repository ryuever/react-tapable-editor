const connectDropTarget = (targetId, node) => {
  const handleDragEnter = e => this.handleDragEnter(e, targetId)
  const handleDragOver = e => this.handleDragOver(e, targetId)
  const handleDrop = e => this.handleDrop(e, targetId)

  node.addEventListener('dragenter', handleDragEnter)
  node.addEventListener('dragover', handleDragOver)
  node.addEventListener('drop', handleDrop)

  return () => {
    node.removeEventListener('dragenter', handleDragEnter)
    node.removeEventListener('dragover', handleDragOver)
    node.removeEventListener('drop', handleDrop)
  }
}

class DropTarget {

}

export default DropTarget