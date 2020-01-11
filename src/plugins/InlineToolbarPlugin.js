import getSelectionRectRelativeToOffsetParent from '../utils/rect/getSelectionRectRelativeToOffsetParent';
import clamp from '../helpers/clamp'
import getRootNode from '../utils/rect/getRootNode'

function InlineToolbar() {
  let isToolbarVisible = false

  // 比如用户选择一个区域，弹出了inline-bar这个时候点击其它非editor中的其它区域；
  // 选中区域会变成灰色；这个时候再点击其中的一个文字，使editor focus，你会发现
  // `inline-bar`会闪现一下；这个是因为，当用户再次点击editor时，它首先触发的刚刚
  // 的`selection`然后再移动到指定的位置
  let timeoutHandler

  const hiddenHandler = (inlineToolbarRef) => {
    clearTimeout(timeoutHandler)

    if (!isToolbarVisible) return
    inlineToolbarRef.current.style.display = 'none'
    inlineToolbarRef.current.style.visibility = 'invisible'
    isToolbarVisible = false
  }

  const visibleHandler = (editorRef, inlineToolbarRef) => {
    clearTimeout(timeoutHandler)
    timeoutHandler = setTimeout(() => {
      // if (isToolbarVisible) return 如果加了这个判断就不能够及时的进行位置更新了
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
    }, 100)
  }

  this.apply = (getEditor) => {
    const { hooks, editorRef, inlineToolbarRef } = getEditor();

    hooks.selectionCollapsedChange.tap('InlineToolbar', (editorState, selectionChanged) => {
      const { newValue: { isCollapsed } } = selectionChanged
      clearTimeout(timeoutHandler)
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

    hooks.selectionFocusChange.tap('InlineToolbar', (editorState, selectionChanged) => {
      const { newValue: { hasFocus, isCollapsed } } = selectionChanged
      if (!hasFocus) hiddenHandler(inlineToolbarRef)
      if (hasFocus && !isCollapsed) visibleHandler(editorRef, inlineToolbarRef)
    })
  };
}

export default InlineToolbar