// https://github.com/facebook/draft-js/blob/master/src/model/transaction/ContentStateInlineStyle.js#L38 modifyInlineStyle
import Immutable from "immutable";
const Map = Immutable.Map;

function getSelectionInlineStyle(editorState) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const blockMap = contentState.getBlockMap();
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const endKey = selectionState.getEndKey();
  const endOffset = selectionState.getEndOffset();

  let styles = new Immutable.OrderedSet();
  let hasChanceToInit = true;
  let intersectionIsEmpty = false;

  blockMap
    .skipUntil(function(_, k) {
      return k === startKey;
    })
    .takeUntil(function(_, k) {
      return k === endKey;
    })
    .concat(Map([[endKey, blockMap.get(endKey)]]))
    .map(function(block, blockKey) {
      if (intersectionIsEmpty) return;

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

        // 只有当前的char包含`inline` style时才进行处理
        if (current.size > 0) {
          if (!styles.size) {
            // 如果已经初始化过了，这个时候`styles`还为空的话，证明`intersect`
            // 以后为空；所以也就没有处理的必要了
            if (!hasChanceToInit) {
              intersectionIsEmpty = true;
              break;
            }
            current.map(style => (styles = styles.add(style)));
            hasChanceToInit = false;
          } else {
            styles = styles.intersect(current);
          }
        }

        sliceStart++;
      }
    });

  return styles;
}

export default getSelectionInlineStyle;
