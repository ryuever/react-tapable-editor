import DraftOffsetKey from "draft-js/lib/DraftOffsetKey";

export const getNodeByOffsetKey = offsetKey => {
  return document.querySelector(
    `[data-block="true"][data-offset-key="${offsetKey}"]`
  );
};

export const getOffsetKey = blockKey => DraftOffsetKey.encode(blockKey, 0, 0);
