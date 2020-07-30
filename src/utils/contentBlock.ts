// https://github.com/facebook/draft-js/blob/master/src/model/immutable/ContentState.js#L128

import { ContentBlockNode } from 'types';

// `%u200B` nonWidthCharacter
export const hasText = (block: ContentBlockNode) =>
  escape(block.getText()).replace(/%u200B/g, '').length > 0;
