import generateOffsetKey from "./generateOffsetKey";

export function getNodeByOffsetKey(blockKey) {
  const offsetKey = generateOffsetKey(blockKey);
  return document.querySelector(`[data-offset-key="${offsetKey}"]`);
}
