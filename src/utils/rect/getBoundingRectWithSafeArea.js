import { getNodeByBlockKey } from "../findNode";
import { generateOffsetKey } from "../keyHelper";

export default function getBoundingRectWithSafeArea(
  editorState,
  safeArea = 100
) {
  const currentState = editorState.getCurrentContent();
  const blockMap = currentState.getBlockMap();
  const coordinateMap = blockMap
    .toArray()
    .map(block => {
      const blockKey = block.getKey();
      const offsetKey = generateOffsetKey(blockKey);
      const node = getNodeByBlockKey(blockKey);
      const childrenSize = block.children.size;

      // node with children should be omitted.
      if (!node || childrenSize) return;
      const { top, right, bottom, left } = node.getBoundingClientRect();
      // right and left both should minus `safeArea`
      return {
        blockKey,
        offsetKey,
        rect: {
          top,
          right: right - safeArea,
          bottom,
          left: left - safeArea
        }
      };
    })
    .filter(v => v);

  return coordinateMap;
}
