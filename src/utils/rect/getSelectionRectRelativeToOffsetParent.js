import getRootNode from './getRootNode'
import { getVisibleSelectionRect } from 'draft-js'

const getSelectionRectRelativeToOffsetParent = editorRef => {
  const rootNode = getRootNode(editorRef)
  const visibleSelectionRect = getVisibleSelectionRect(window)
  console.log('visible ', visibleSelectionRect)
  if (!rootNode || !visibleSelectionRect) return
  const rootRect = rootNode.getBoundingClientRect()
  const rootOffsetTop = rootNode.offsetTop
  const rootOffsetLeft = rootNode.offsetLeft
  const { width, height } = visibleSelectionRect

  const top = rootOffsetTop + visibleSelectionRect.top - rootRect.top
  const left = rootOffsetLeft + visibleSelectionRect.left - rootRect.left

  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
    width,
    height,
  }
}

export default getSelectionRectRelativeToOffsetParent