import { getNodeByBlockKey } from "../findNode";
import { generateOffsetKey } from "../keyHelper";

export default function getBoundingRectWithSafeArea(
  editorState,
  safeArea = 100
) {
  const currentState = editorState.getCurrentContent();
  const blockMap = currentState.getBlockMap();

  // mainly, used to display sidebar
  const shiftLeft = [];
  // mainly, used to display drop direction bar..
  const shiftRight = [];

  const coordinateMap = blockMap.toArray().forEach(block => {
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
        left: left - safeArea
      }
    });

    shiftRight.push({
      blockKey,
      offsetKey,
      rect: {
        top,
        right: right + safeArea,
        bottom,
        left: left + safeArea
      }
    });
  });
  console.log("shift ", shiftLeft);

  return {
    shiftLeft: shiftLeft.filter(v => v),
    shiftRight: shiftRight.filter(v => v)
  };
}
