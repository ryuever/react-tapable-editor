export const getNodeByOffsetKey = offsetKey => {
  return document.querySelector(`[data-block="true"][data-offset-key="${offsetKey}"]`)
}

export const getOffsetKeyNodeChildren = offsetKey => {
  return document.querySelectorAll(`[data-block="true"][data-offset-key="${offsetKey}"] div.sidebar-addon`)
}

export const getSelectableNodeByListenerKey = listenerKey => {
  return document.querySelector(`[data-block="true"] [data-id="${listenerKey}"] div.selectable`)
}