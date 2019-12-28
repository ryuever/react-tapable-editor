// https://github.com/facebook/draft-js/blob/master/src/model/immutable/ContentState.js#L128
// `%u200B` nonWidthCharacter
export const hasText = block => escape(block.getText()).replace(/%u200B/g, '').length > 0