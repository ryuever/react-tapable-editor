/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *
 * @emails oncall+draft_js
 */
"use strict";

var getDraftEditorSelectionWithNodes = require("./getDraftEditorSelectionWithNodes");
/**
 * Convert the current selection range to an anchor/focus pair of offset keys
 * and values that can be interpreted by components.
 */

function getDraftEditorSelection(editorState, root) {
  var selection = root.ownerDocument.defaultView.getSelection(); // No active selection.

  if (selection.rangeCount === 0) {
    return {
      selectionState: editorState.getSelection().set("hasFocus", false),
      needsRecovery: false
    };
  }

  return getDraftEditorSelectionWithNodes(
    editorState,
    root,
    selection.anchorNode,
    selection.anchorOffset,
    selection.focusNode,
    selection.focusOffset
  );
}

module.exports = getDraftEditorSelection;
