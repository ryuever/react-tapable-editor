// https://github.com/alexreardon/css-box-model/blob/master/src/index.js

import { EditorState } from 'draft-js';
import { getNodeByBlockKey } from '../findNode';
import { generateOffsetKey } from '../keyHelper';
import { SafeArea } from '../../types';

export default function getBoundingRectWithSafeArea(
  editorState: EditorState,
  safeArea = 100
) {
  const currentState = editorState.getCurrentContent();
  const blockMap = currentState.getBlockMap();

  // mainly, used to display sidebar
  const shiftLeft = [] as SafeArea[];
  // mainly, used to display drop direction bar..
  const shiftRight = [] as SafeArea[];

  blockMap.toArray().forEach(block => {
    const blockKey = block.getKey();
    const offsetKey = generateOffsetKey(blockKey);
    const node = getNodeByBlockKey(blockKey);
    const childrenSize = block.children.size;

    // node with children should be omitted.
    if (!node || childrenSize) return;

    const { top, right, bottom, left } = node.getBoundingClientRect();
    // right and left both should minus `safeArea`

    shiftLeft.push({
      blockKey,
      offsetKey,
      rect: {
        top,
        right: right - safeArea,
        bottom,
        left: left - safeArea,
      },
    });

    shiftRight.push({
      blockKey,
      offsetKey,
      rect: {
        top,
        right: right + safeArea,
        bottom,
        left: left + safeArea,
      },
    });
  });

  return {
    shiftLeft: shiftLeft.filter(v => v),
    shiftRight: shiftRight.filter(v => v),
  };
}
