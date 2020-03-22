import { getNodeByOffsetKey } from "../findNode";

export default function getBoundingRectWithSafeArea(
  editorState,
  safeArea = 100
) {
  const currentState = editorState.getCurrentContent();
  const blockMap = currentState.getBlockMap();
  const coordinateMap = blockMap.toArray().map(block => {
    const key = block.getKey();
    const node = getNodeByOffsetKey(key);
    const { top, right, bottom, left } = node.getBoundingClientRect();
    return {
      key,
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
