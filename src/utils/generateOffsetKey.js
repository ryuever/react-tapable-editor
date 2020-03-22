import DraftOffsetKey from "draft-js/lib/DraftOffsetKey";

export default function generateOffsetKey(blockKey) {
  return DraftOffsetKey.encode(blockKey, 0, 0);
}
