// @ts-nocheck

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

var EditorState = require('draft-js/lib/EditorState');

// var SecondaryClipboard = require("./SecondaryClipboard");

// var keyCommandBackspaceToStartOfLine = require("./keyCommandBackspaceToStartOfLine");

// var keyCommandBackspaceWord = require("./keyCommandBackspaceWord");

// var keyCommandDeleteWord = require("./keyCommandDeleteWord");

// var keyCommandInsertNewline = require("./keyCommandInsertNewline");

// var keyCommandMoveSelectionToEndOfBlock = require("./keyCommandMoveSelectionToEndOfBlock");

// var keyCommandMoveSelectionToStartOfBlock = require("./keyCommandMoveSelectionToStartOfBlock");

var keyCommandPlainBackspace = require('./lib/keyCommandPlainBackspace');

// var keyCommandPlainDelete = require("./keyCommandPlainDelete");

// var keyCommandTransposeCharacters = require("./keyCommandTransposeCharacters");

var NestedRichTextEditorUtil = require('./lib/NestedRichTextEditorUtil');

/**
 * Map a `DraftEditorCommand` command value to a corresponding function.
 */

function onKeyCommand(command, editorState, e) {
  switch (command) {
    // case 'redo':
    //   return EditorState.redo(editorState);

    // case 'delete':
    //   return keyCommandPlainDelete(editorState);

    // case 'delete-word':
    //   return keyCommandDeleteWord(editorState);

    case 'backspace':
      return keyCommandPlainBackspace(editorState);

    // case 'backspace-word':
    //   return keyCommandBackspaceWord(editorState);

    // case 'backspace-to-start-of-line':
    //   return keyCommandBackspaceToStartOfLine(editorState, e);

    // case 'split-block':
    //   return keyCommandInsertNewline(editorState);

    // case 'transpose-characters':
    //   return keyCommandTransposeCharacters(editorState);

    // case 'move-selection-to-start-of-block':
    //   return keyCommandMoveSelectionToStartOfBlock(editorState);

    // case 'move-selection-to-end-of-block':
    //   return keyCommandMoveSelectionToEndOfBlock(editorState);

    // case 'secondary-cut':
    //   return SecondaryClipboard.cut(editorState);

    // case 'secondary-paste':
    //   return SecondaryClipboard.paste(editorState);

    // default:
    //   return editorState;

    default:
      return;
  }
}

function decorateKeyCommandHandler(editorState, command) {
  const newState = NestedRichTextEditorUtil.handleKeyCommand(
    editorState,
    command
  );
  if (newState) return newState;

  return onKeyCommand(command, editorState);
}

export default decorateKeyCommandHandler;
