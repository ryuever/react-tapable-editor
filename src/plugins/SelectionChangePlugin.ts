import { GetEditor } from 'types';
import { SelectionState } from 'draft-js';

const resolveChangeType = ({
  prevIsCollapsed,
  prevHasFocus,
  prevSelection,
  isCollapsed,
  hasFocus,
  selection,
}: {
  prevIsCollapsed: boolean;
  prevHasFocus: boolean;
  prevSelection: SelectionState;
  isCollapsed: boolean;
  hasFocus: boolean;
  selection: SelectionState;
}) => {
  if (typeof prevIsCollapsed === 'undefined') {
    return 'init-change';
  }

  if (isCollapsed !== prevIsCollapsed) {
    return 'collapsed-change';
  }

  if (hasFocus !== prevHasFocus) {
    return 'focus-change';
  }

  if (isCollapsed) {
    const prevStartKey = prevSelection.getStartKey();
    const startKey = selection.getStartKey();

    if (prevStartKey === startKey) return 'selection-move-inner-block';
    return 'selection-move-outer-block';
  }
  const prevEndKey = prevSelection.getEndKey();
  const prevStartOffset = prevSelection.getStartOffset();
  const prevEndOffset = prevSelection.getEndOffset();
  const endKey = selection.getEndKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();

  if (
    prevEndKey === endKey &&
    prevStartOffset === startOffset &&
    prevEndOffset === endOffset
  ) {
    return 'selection-range-content-change';
  }

  return 'selection-range-size-change';
};

function SelectionChangePlugin() {
  let prevIsCollapsed: boolean;
  let prevSelection: SelectionState;
  let prevHasFocus: boolean;

  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();

    hooks.syncSelectionChange.tap('SelectionChangePlugin', editorState => {
      const selection = editorState.getSelection();
      const isCollapsed = selection.isCollapsed();
      const hasFocus = selection.getHasFocus();

      const changeType = resolveChangeType({
        prevIsCollapsed,
        prevHasFocus,
        prevSelection,
        isCollapsed,
        hasFocus,
        selection,
      });

      const payload = {
        changeType,
        oldValue: { prevIsCollapsed, prevHasFocus, prevSelection },
        newValue: { isCollapsed, hasFocus, selection },
      };

      prevIsCollapsed = isCollapsed;
      prevHasFocus = hasFocus;
      prevSelection = selection;

      switch (changeType) {
        case 'init-change':
          hooks.selectionInitChange.call(editorState, payload);
          break;
        case 'collapsed-change':
          hooks.selectionCollapsedChange.call(editorState, payload);
          break;
        case 'focus-change':
          hooks.selectionFocusChange.call(editorState, payload);
          break;
        case 'selection-move-inner-block':
          hooks.selectionMoveInnerBlock.call(editorState, payload);
          break;
        case 'selection-move-outer-block':
          hooks.selectionMoveOuterBlock.call(editorState, payload);
          break;
        case 'selection-range-content-change':
          hooks.selectionRangeContentChange.call(editorState, payload);
          hooks.selectionRangeChange.call(editorState, payload);
          break;
        case 'selection-range-size-change':
          hooks.selectionRangeSizeChange.call(editorState, payload);
          hooks.selectionRangeChange.call(editorState, payload);
          break;
        default:
        // do nothing
      }
    });
  };
}

export default SelectionChangePlugin;
