import getSelectionRectRelativeToOffsetParent from '../utils/rect/getSelectionRectRelativeToOffsetParent';
import clamp from '../helpers/clamp'
import getRootNode from '../utils/rect/getRootNode'

function InlineToolbar() {
  let isToolbarVisible = false

  const hiddenHandler = (inlineToolbarRef) => {
    inlineToolbarRef.current.style.display = 'none'
    inlineToolbarRef.current.style.visibility = 'invisible'
    isToolbarVisible = false
  }

  const visibleHandler = (editorRef, inlineToolbarRef) => {
    if (!inlineToolbarRef.current) return
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
    } else {
      inlineToolbarRef.current.style.overflow = 'visible'
    }
    isToolbarVisible = true
  }

  this.apply = (getEditor) => {
    const { hooks, editorRef, inlineToolbarRef } = getEditor();

    hooks.selectionCollapsedChange.tap('InlineToolbar', (editorState, selectionChanged) => {
      const { newValue: { isCollapsed } } = selectionChanged
      if (isCollapsed && isToolbarVisible) {
        hiddenHandler(inlineToolbarRef)
      }

      if (!isCollapsed) {
        visibleHandler(editorRef, inlineToolbarRef)
      }
    });

    hooks.selectionRangeChange.tap('InlineToolbar', (editorState, selectionChanged) => {
      visibleHandler(editorRef, inlineToolbarRef)
    });

    // hooks.selectionFocusChange.tap('InlineToolbar', (editorState, selectionChanged) => {
    //   const { newValue: { hasFocus } } = selectionChanged
    //   if (!hasFocus) hiddenHandler(inlineToolbarRef)
    // })
  };
}

export default InlineToolbar