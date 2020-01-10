import getSelectionRectRelativeToOffsetParent from '../utils/rect/getSelectionRectRelativeToOffsetParent';

function AlignmentPlugin() {
  this.apply = (getEditor) => {
    const { hooks, editorRef } = getEditor();

    hooks.selectionCollapsedChange.tap('AlignmentPlugin', (editorState, selectionChanged) => {
      const { type, payload } = selectionChanged
      if (type !== 'isCollapsed-change') return

      console.log("relative : ", getSelectionRectRelativeToOffsetParent(editorRef))
    });
  };
}

export default AlignmentPlugin