import { generateOffsetKey } from "./keyHelper";

export function getNodeByBlockKey(blockKey) {
  const offsetKey = generateOffsetKey(blockKey);
  return document.querySelector(
    `[data-block="true"][data-offset-key="${offsetKey}"]`
  );
}

export const getNodeByOffsetKey = offsetKey => {
  return document.querySelector(
    `[data-block="true"][data-offset-key="${offsetKey}"]`
  );
};

// https://stackoverflow.com/questions/29937768/document-queryselector-multiple-data-attributes-in-one-element
// consecutive selector should not has spaces between them
export const getOffsetKeyNodeChildren = offsetKey => {
  return document.querySelectorAll(
    `[data-block="true"][data-offset-key="${offsetKey}"] div.sidebar-addon`
  );
};

export const getSelectableNodeByOffsetKey = offsetKey => {
  return document.querySelector(
    `[data-block="true"] [data-id="${offsetKey}"] div.selectable`
  );
};
