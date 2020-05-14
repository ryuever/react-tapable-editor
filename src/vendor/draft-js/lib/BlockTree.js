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

var findRangesImmutable = require("./findRangesImmutable");

var Immutable = require("immutable");

var List = Immutable.List,
  Repeat = Immutable.Repeat,
  Record = Immutable.Record;

var returnTrue = function returnTrue() {
  return true;
};

var defaultLeafRange = {
  start: null,
  end: null
};
var LeafRange = Record(defaultLeafRange);
var defaultDecoratorRange = {
  start: null,
  end: null,
  decoratorKey: null,
  leaves: null
};
var DecoratorRange = Record(defaultDecoratorRange);
var BlockTree = {
  /**
   * Generate a block tree for a given ContentBlock/decorator pair.
   */
  generate: function generate(contentState, block, decorator) {
    var textLength = block.getLength();

    if (!textLength) {
      return List.of(
        new DecoratorRange({
          start: 0,
          end: 0,
          decoratorKey: null,
          leaves: List.of(
            new LeafRange({
              start: 0,
              end: 0
            })
          )
        })
      );
    }

    var leafSets = [];
    var decorations = decorator
      ? decorator.getDecorations(block, contentState)
      : List(Repeat(null, textLength));
    var chars = block.getCharacterList();
    findRangesImmutable(decorations, areEqual, returnTrue, function(
      start,
      end
    ) {
      leafSets.push(
        new DecoratorRange({
          start: start,
          end: end,
          decoratorKey: decorations.get(start),
          leaves: generateLeaves(chars.slice(start, end).toList(), start)
        })
      );
    });
    return List(leafSets);
  }
};
/**
 * Generate LeafRange records for a given character list.
 */

function generateLeaves(characters, offset) {
  var leaves = [];
  var inlineStyles = characters
    .map(function(c) {
      return c.getStyle();
    })
    .toList();
  findRangesImmutable(inlineStyles, areEqual, returnTrue, function(start, end) {
    leaves.push(
      new LeafRange({
        start: start + offset,
        end: end + offset
      })
    );
  });
  return List(leaves);
}

function areEqual(a, b) {
  return a === b;
}

module.exports = BlockTree;
