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

var addEntityToEntityMap = require("./addEntityToEntityMap");

function addEntityToContentState(contentState, instance) {
  return contentState.set(
    "entityMap",
    addEntityToEntityMap(contentState.getEntityMap(), instance)
  );
}

module.exports = addEntityToContentState;
