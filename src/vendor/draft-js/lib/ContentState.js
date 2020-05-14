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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var BlockMapBuilder = require("./BlockMapBuilder");

var CharacterMetadata = require("./CharacterMetadata");

var ContentBlock = require("./ContentBlock");

var ContentBlockNode = require("./ContentBlockNode");

var DraftEntity = require("./DraftEntity");

var SelectionState = require("./SelectionState");

var generateRandomKey = require("./generateRandomKey");

var gkx = require("./gkx");

var Immutable = require("immutable");

var sanitizeDraftText = require("./sanitizeDraftText");

var List = Immutable.List,
  Record = Immutable.Record,
  Repeat = Immutable.Repeat;
var defaultRecord = {
  entityMap: null,
  blockMap: null,
  selectionBefore: null,
  selectionAfter: null
};
var ContentStateRecord = Record(defaultRecord);

var ContentState =
  /*#__PURE__*/
  (function(_ContentStateRecord) {
    _inheritsLoose(ContentState, _ContentStateRecord);

    function ContentState() {
      return _ContentStateRecord.apply(this, arguments) || this;
    }

    var _proto = ContentState.prototype;

    _proto.getEntityMap = function getEntityMap() {
      // TODO: update this when we fully remove DraftEntity
      return DraftEntity;
    };

    _proto.getBlockMap = function getBlockMap() {
      return this.get("blockMap");
    };

    _proto.getSelectionBefore = function getSelectionBefore() {
      return this.get("selectionBefore");
    };

    _proto.getSelectionAfter = function getSelectionAfter() {
      return this.get("selectionAfter");
    };

    _proto.getBlockForKey = function getBlockForKey(key) {
      var block = this.getBlockMap().get(key);
      return block;
    };

    _proto.getKeyBefore = function getKeyBefore(key) {
      return this.getBlockMap()
        .reverse()
        .keySeq()
        .skipUntil(function(v) {
          return v === key;
        })
        .skip(1)
        .first();
    };

    _proto.getKeyAfter = function getKeyAfter(key) {
      return this.getBlockMap()
        .keySeq()
        .skipUntil(function(v) {
          return v === key;
        })
        .skip(1)
        .first();
    };

    _proto.getBlockAfter = function getBlockAfter(key) {
      return this.getBlockMap()
        .skipUntil(function(_, k) {
          return k === key;
        })
        .skip(1)
        .first();
    };

    _proto.getBlockBefore = function getBlockBefore(key) {
      return this.getBlockMap()
        .reverse()
        .skipUntil(function(_, k) {
          return k === key;
        })
        .skip(1)
        .first();
    };

    _proto.getBlocksAsArray = function getBlocksAsArray() {
      return this.getBlockMap().toArray();
    };

    _proto.getFirstBlock = function getFirstBlock() {
      return this.getBlockMap().first();
    };

    _proto.getLastBlock = function getLastBlock() {
      return this.getBlockMap().last();
    };

    _proto.getPlainText = function getPlainText(delimiter) {
      return this.getBlockMap()
        .map(function(block) {
          return block ? block.getText() : "";
        })
        .join(delimiter || "\n");
    };

    _proto.getLastCreatedEntityKey = function getLastCreatedEntityKey() {
      // TODO: update this when we fully remove DraftEntity
      return DraftEntity.__getLastCreatedEntityKey();
    };

    _proto.hasText = function hasText() {
      var blockMap = this.getBlockMap();
      return (
        blockMap.size > 1 || // make sure that there are no zero width space chars
        escape(blockMap.first().getText()).replace(/%u200B/g, "").length > 0
      );
    };

    _proto.createEntity = function createEntity(type, mutability, data) {
      // TODO: update this when we fully remove DraftEntity
      DraftEntity.__create(type, mutability, data);

      return this;
    };

    _proto.mergeEntityData = function mergeEntityData(key, toMerge) {
      // TODO: update this when we fully remove DraftEntity
      DraftEntity.__mergeData(key, toMerge);

      return this;
    };

    _proto.replaceEntityData = function replaceEntityData(key, newData) {
      // TODO: update this when we fully remove DraftEntity
      DraftEntity.__replaceData(key, newData);

      return this;
    };

    _proto.addEntity = function addEntity(instance) {
      // TODO: update this when we fully remove DraftEntity
      DraftEntity.__add(instance);

      return this;
    };

    _proto.getEntity = function getEntity(key) {
      // TODO: update this when we fully remove DraftEntity
      return DraftEntity.__get(key);
    };

    ContentState.createFromBlockArray = function createFromBlockArray( // TODO: update flow type when we completely deprecate the old entity API
      blocks,
      entityMap
    ) {
      // TODO: remove this when we completely deprecate the old entity API
      var theBlocks = Array.isArray(blocks) ? blocks : blocks.contentBlocks;
      var blockMap = BlockMapBuilder.createFromArray(theBlocks);
      var selectionState = blockMap.isEmpty()
        ? new SelectionState()
        : SelectionState.createEmpty(blockMap.first().getKey());
      return new ContentState({
        blockMap: blockMap,
        entityMap: entityMap || DraftEntity,
        selectionBefore: selectionState,
        selectionAfter: selectionState
      });
    };

    ContentState.createFromText = function createFromText(text) {
      var delimiter =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : /\r\n?|\n/g;
      var strings = text.split(delimiter);
      var blocks = strings.map(function(block) {
        block = sanitizeDraftText(block);
        var ContentBlockNodeRecord = gkx("draft_tree_data_support")
          ? ContentBlockNode
          : ContentBlock;
        return new ContentBlockNodeRecord({
          key: generateRandomKey(),
          text: block,
          type: "unstyled",
          characterList: List(Repeat(CharacterMetadata.EMPTY, block.length))
        });
      });
      return ContentState.createFromBlockArray(blocks);
    };

    return ContentState;
  })(ContentStateRecord);

module.exports = ContentState;
