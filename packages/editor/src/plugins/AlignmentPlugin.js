import getSelectionRectRelativeToOffsetParent from '../utils/rect/getSelectionRectRelativeToOffsetParent';

function AlignmentPlugin() {
  this.apply = (getEditor) => {
    const { hooks, editorRef } = getEditor();

    hooks.onBlockSelectionChange.tap('AlignmentPlugin', (editorState, selectionChanged) => {
      const { type, payload } = selectionChanged
      console.log('type ', type, payload)
      if (type !== 'isCollapsed-change') return

      console.log("relative : ", getSelectionRectRelativeToOffsetParent(editorRef))
    });
  };
}

export default AlignmentPlugin