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

var DraftEntityInstance = require("./DraftEntityInstance");

var addEntityToContentState = require("./addEntityToContentState");

function createEntityInContentState(contentState, type, mutability, data) {
  return addEntityToContentState(
    contentState,
    new DraftEntityInstance({
      type: type,
      mutability: mutability,
      data: data || {}
    })
  );
}

module.exports = createEntityInContentState;
