import { getNodeByBlockKey } from "../findNode";
import { generateOffsetKey } from "../keyHelper";

export default function getBoundingRectWithSafeArea(
  editorState,
  safeArea = 100
) {
  const currentState = editorState.getCurrentContent();
  const blockMap = currentState.getBlockMap();
  const coordinateMap = blockMap.toArray().map(block => {
    const blockKey = block.getKey();
    const offsetKey = generateOffsetKey(blockKey);
    const node = getNodeByBlockKey(blockKey);
    const { top, right, bottom, left } = node.getBoundingClientRect();
    return {
      blockKey,
      offsetKey,
      rect: {
        top,
        right,
        bottom,
        left: left - safeArea
      }
    };
  });

  return coordinateMap;
}
