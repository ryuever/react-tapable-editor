import { getNodeByOffsetKey } from "../findNode";

export default function getBoundingRectWithSafeArea(editorState) {
  const currentState = editorState.getCurrentContent();
  const blockMap = currentState.getBlockMap();
  blockMap.toArray().forEach(block => {
    const key = block.getKey();
    const node = getNodeByOffsetKey(key);
    const rect = node.getBoundingClientRect();
    console.log("block key ", key, node, rect);
  });
}
