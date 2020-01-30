class DragDropManager {
  constructor(getEditor) {
    this.dragSourceId = null
    this.getEditor = getEditor
  }

  prepare({
    candidateSourceNode,
    candidateSourceId,
  }) {
    this.globalPrepareCleanUp = this.prepareGlobalEventHandler()
    this.sourcePrepareCleanUp = this.prepareCandidateSourceHandler({
      candidateSourceNode,
      candidateSourceId,
    })
  }

  prepareGlobalEventHandler() {
    window.addEventListener('dragstart', this.globalDragStartHandler, true)
    window.addEventListener('dragenter', this.globalDragEnterHandler, true)

    return () => {
      window.removeEventListener('dragstart', this.globalDragStartHandler, true)
      window.removeEventListener('dragenter', this.globalDragEnterHandler, true)

    }
  }

  prepareCandidateSourceHandler({
    candidateSourceNode,
    candidateSourceId,
  }) {
    const dragStartHandler = e => this.dragStartHandler(e, candidateSourceId)
    candidateSourceNode.addEventListener('dragstart', dragStartHandler)

    return () => {
      candidateSourceNode.removeEventListener('dragstart', dragStartHandler)
    }
  }

  globalDragStartHandler = e => {
    this.dragSourceId = null
  }

  globalDragEnterHandler = e => {
    this.dropTargetId = null
  }

  dragStartHandler = (e, sourceId) => {
    this.dragSourceId = sourceId
    const
  }

  setup() {

  }

  teardown() {

  }
}

export default new DragDropManager()