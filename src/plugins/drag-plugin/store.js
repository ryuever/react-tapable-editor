class Store {
  constructor() {
    this.dropTargetIds = []
    this.sourceId = null
    this.dragSourceIds = []
  }

  updateOffset() {

  }

  setDropTargetIds(targetIds) {
    this.dropTargetIds = targetIds
  }

  setDragSourceIds(sourceIds) {
    this.dragSourceIds = sourceIds
  }

}

export default new Store()