const isBlockFocused = (editorState, content) => {
  const selection = editorState.getSelection();
  // 首先判断当前selection是否是focused
  if (!selection.getHasFocus()) return false;

  // 主要解决的是，比如block是否被focus；所以如果说selection不是`isCollapsed`的
  // 话，直接返回false 不再处理
  if (!selection.isCollapsed()) return false;

  const blockKey = content.getKey();
  const startKey = selection.getStartKey();

  return blockKey === startKey;
};

export default isBlockFocused;
