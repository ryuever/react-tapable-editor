import DragSource from './DragSource'
import DropTarget from './DropTarget'

class Subscription {
  constructor() {
    this.listeners = []
  }

  addTarget(blockKey, node) {
    const targetId = new DropTarget(blockKey, node)
  }

  addSource(blockKey, node) {
    const sourceId = new DragSource(blockKey, node)
  }
}

export default new Subscription()