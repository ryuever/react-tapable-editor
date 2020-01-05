import getRootNode from './getRootNode'
import { getVisibleSelectionRect } from 'draft-js'

const getSelectionRectRelativeToOffsetParent = editorRef => {
  const rootNode = getRootNode(editorRef)
  const visibleSelectionRect = getVisibleSelectionRect(window)
  if (!rootNode || !visibleSelectionRect) return
  const rootRect = rootNode.getBoundingClientRect()
  const rootOffsetTop = rootNode.offsetTop
  const rootOffsetLeft = rootNode.offsetLeft

  return {
    top: rootOffsetTop + visibleSelectionRect.top - rootRect.top,
    left: rootOffsetLeft + visibleSelectionRect.left - rootRect.left,
  }
}

export default getSelectionRectRelativeToOffsetParent