import getSelectionRectRelativeToOffsetParent from '../utils/rect/getSelectionRectRelativeToOffsetParent';
import clamp from '../helpers/clamp'
import getRootNode from '../utils/rect/getRootNode'

function InlineToolbar() {
  this.apply = (getEditor) => {
    const { hooks, editorRef, imageToolbarRef, inlineToolbarRef } = getEditor();

    hooks.onBlockSelectionChange.tap('InlineToolbar', (editorState, selectionChanged) => {
      if (!inlineToolbarRef.current) return
      const { type, payload } = selectionChanged
      console.log('type ', type, payload)
      if (type !== 'isCollapsed-change') return

      const rect = getSelectionRectRelativeToOffsetParent(editorRef)
      if (!rect) return

      inlineToolbarRef.current.style.display = 'block'
      inlineToolbarRef.current.style.visibility = 'visible'

      const { top, left, width } = rect
      const inlineToolbarHeight = inlineToolbarRef.current.offsetHeight
      const inlineToolbarWidth = inlineToolbarRef.current.offsetWidth
      const nextTop = top - inlineToolbarHeight - 15
      const rootNode = getRootNode(editorRef)
      const offsetRight = rootNode.offsetRight

      // 考虑到left的最小和最大值的边界
      const minLeft = 0
      const maxLeft = offsetRight - inlineToolbarRef.current.offsetWidth
      const tmpLeft = left - inlineToolbarWidth / 2 + width / 2

      const nextLeft = clamp(tmpLeft, minLeft, maxLeft)

      inlineToolbarRef.current.style.top = `${nextTop}px`
      inlineToolbarRef.current.style.left = `${nextLeft}px`

      if (tmpLeft !== nextLeft) {
        // 已经移动到了边界，这个时候不应该再显示三角符号
        inlineToolbarRef.current.style.overflow = 'hidden'
      }
    });
  };
}

export default InlineToolbar