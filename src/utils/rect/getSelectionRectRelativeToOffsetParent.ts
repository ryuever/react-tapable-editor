import { getVisibleSelectionRect } from 'draft-js';
import getRootNode from './getRootNode';
import { EditorRef, RectObject } from '../../types';

const getSelectionRectRelativeToOffsetParent = (
  editorRef: EditorRef
): RectObject | undefined => {
  const rootNode = getRootNode(editorRef);
  const visibleSelectionRect = getVisibleSelectionRect(window);
  if (!rootNode || !visibleSelectionRect) return;
  const rootRect = rootNode.getBoundingClientRect();
  const rootOffsetTop = rootNode.offsetTop;
  const rootOffsetLeft = rootNode.offsetLeft;
  const { width, height } = visibleSelectionRect;

  const top = rootOffsetTop + visibleSelectionRect.top - rootRect.top;
  const left = rootOffsetLeft + visibleSelectionRect.left - rootRect.left;

  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
};

export default getSelectionRectRelativeToOffsetParent;
