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

// TODO: when removing the deprecated API update this to use the EntityMap type
// instead of OrderedMap
var key = 0;

function addEntityToEntityMap(entityMap, instance) {
  return entityMap.set("".concat(++key), instance);
}

module.exports = addEntityToEntityMap;
