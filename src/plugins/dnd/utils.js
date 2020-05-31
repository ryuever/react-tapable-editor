// https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object
export const isElement = el =>
  el instanceof Element || el instanceof HTMLDocument;
