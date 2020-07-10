import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

export function generateOffsetKey(blockKey) {
  return DraftOffsetKey.encode(blockKey, 0, 0);
}

// offsetKey: erm6t-0-0
export function extractBlockKeyFromOffsetKey(offsetKey) {
  const parts = offsetKey.split('-');
  return parts[0];
}
