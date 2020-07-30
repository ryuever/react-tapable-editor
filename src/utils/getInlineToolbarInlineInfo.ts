// https://github.com/facebook/draft-js/blob/master/src/model/transaction/ContentStateInlineStyle.js#L38 modifyInlineStyle
import Immutable from 'immutable';
import { EditorState } from 'draft-js';
import { BlockNodeMap, ContentBlockNode } from 'types';

const { Map } = Immutable;

function getInlineToolbarInlineInfo(editorState: EditorState) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const blockMap = contentState.getBlockMap() as BlockNodeMap;
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const endKey = selectionState.getEndKey();
  const endOffset = selectionState.getEndOffset();

  let values;
  let hasChanceToInit = true;
  let intersectionIsEmpty = false;
  let hasLink = false;

  blockMap
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat(Map([[endKey, blockMap.get(endKey)]]))
    .forEach(function(block, blockKey) {
      if (hasLink && intersectionIsEmpty) {
        return;
      }

      let styles = Immutable.OrderedSet();

      let sliceStart;
      let sliceEnd;

      if (startKey === endKey) {
        sliceStart = startOffset;
        sliceEnd = endOffset;
      } else {
        sliceStart = blockKey === startKey ? startOffset : 0;
        sliceEnd =
          blockKey === endKey
            ? endOffset
            : (block as ContentBlockNode).getLength();
      }

      const chars = (block as ContentBlockNode).getCharacterList();
      let current;

      while (sliceStart < sliceEnd) {
        if (hasLink && intersectionIsEmpty) {
          break;
        }

        const char = chars.get(sliceStart);
        current = char!.getStyle();

        const entityKey = char!.getEntity();
        if (entityKey) {
          const entityType = contentState.getEntity(entityKey).getType();
          hasLink = entityType === 'LINK';
        }

        // 计算inline `styles`；一旦已经知道`intersect`为空，那么就不再进行处理了
        if (!intersectionIsEmpty) {
          // 只有当前的char包含`inline` style时才进行处理
          if (current.size > 0) {
            if (!styles.size) {
              // 如果已经初始化过了，这个时候`styles`还为空的话，证明`intersect`
              // 以后为空；所以也就没有处理的必要了
              if (!hasChanceToInit) {
                intersectionIsEmpty = true;
              } else {
                current.forEach(style => styles.add(style)); // eslint-disable-line
                hasChanceToInit = false;
              }
            } else {
              styles = styles.intersect(current);
            }
          }
        }

        sliceStart++;
      }

      values = styles;
    });

  return {
    styles: values,
    hasLink,
  };
}

export default getInlineToolbarInlineInfo;
