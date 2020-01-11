// refer to modifyInlineStyle
import Immutable from 'immutable'
const Map = Immutable.Map

function getSelectionInlineStyle(editorState) {
  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()

  const blockMap = contentState.getBlockMap();
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const endKey = selectionState.getEndKey();
  const endOffset = selectionState.getEndOffset();

  let styles = new Immutable.OrderedSet()

  blockMap.skipUntil(function (_, k) {
    return k === startKey;
  }).takeUntil(function (_, k) {
    return k === endKey;
  }).concat(Map([[endKey, blockMap.get(endKey)]])).map(function (block, blockKey) {
    let sliceStart;
    let sliceEnd;

    if (startKey === endKey) {
      sliceStart = startOffset;
      sliceEnd = endOffset;
    } else {
      sliceStart = blockKey === startKey ? startOffset : 0;
      sliceEnd = blockKey === endKey ? endOffset : block.getLength();
    }

    let chars = block.getCharacterList();
    let current;

    while (sliceStart < sliceEnd) {
      current = chars.get(sliceStart).getStyle();

      if (current.size > 0) {
        if (!styles.size) {
          current.map(style => styles = styles.add(style))
        } else {
          styles = styles.intersect(current)
        }
      }

      sliceStart++
    }
  })

  return styles
}

export default getSelectionInlineStyle