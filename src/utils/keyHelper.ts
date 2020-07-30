// @ts-ignore
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

export function generateOffsetKey(blockKey: string): string {
  return DraftOffsetKey.encode(blockKey, 0, 0);
}

// offsetKey: erm6t-0-0
export function extractBlockKeyFromOffsetKey(offsetKey: string): string {
  const parts = offsetKey.split('-');
  return parts[0];
}
